"use client";

import { Suspense, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { getStripe } from "@/lib/stripeClient";
import { useLanguage } from "@/lib/i18n";

function SubscribeStatus() {
  const { t } = useLanguage();
  const params = useSearchParams();
  const success = params.get("success");
  const canceled = params.get("canceled");

  if (success) {
    return (
      <p className="text-sm text-center rounded-xl border border-primary bg-primary/10 px-4 py-3">
        {t.subscribe.success}
      </p>
    );
  }
  if (canceled) {
    return (
      <p className="text-sm text-center rounded-xl border border-border px-4 py-3 text-muted">
        {t.subscribe.canceled}
      </p>
    );
  }
  return null;
}

function EmailStep({ onReady }: { onReady: (clientSecret: string) => void }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError(t.subscribe.emailRequired);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data?.clientSecret) {
        onReady(data.clientSecret);
        return;
      }
      setError(data?.error || t.pricing.errorGeneric);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.pricing.errorNetwork);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
      <div className="flex flex-col gap-2 text-start">
        <label htmlFor="email" className="text-sm text-muted">
          {t.subscribe.emailLabel}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.subscribe.emailPlaceholder}
          dir="ltr"
          className="w-full rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl py-3.5 font-semibold text-white bg-gradient-to-l from-primary to-primary-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {loading ? t.subscribe.continueLoading : t.subscribe.continueCta}
      </button>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </form>
  );
}

function PaymentStep() {
  const { t } = useLanguage();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscribe?success=true`,
      },
    });

    if (confirmError) {
      setError(confirmError.message || t.pricing.errorGeneric);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 flex flex-col gap-4">
      <PaymentElement />

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="w-full rounded-xl py-3.5 font-semibold text-white bg-gradient-to-l from-primary to-primary-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {loading ? t.subscribe.payLoading : t.subscribe.payCta}
      </button>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <p className="text-xs text-muted text-center">{t.pricing.secure}</p>
    </form>
  );
}

export default function SubscribePage() {
  const { t } = useLanguage();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const options: StripeElementsOptions | undefined = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#7c5cff",
            colorBackground: "#1a1c2c",
            colorText: "#f2f3f8",
            colorTextSecondary: "#9497ad",
            colorDanger: "#ff5c9d",
            borderRadius: "12px",
            fontFamily: "var(--font-vazirmatn), sans-serif",
          },
        },
      }
    : undefined;

  return (
    <div className="flex flex-col flex-1 items-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">{t.subscribe.title}</span>
          </h1>
          <p className="text-muted text-sm">{t.subscribe.subtitle}</p>
        </div>

        <Suspense fallback={null}>
          <SubscribeStatus />
        </Suspense>

        {clientSecret && options ? (
          <Elements stripe={getStripe()} options={options}>
            <PaymentStep />
          </Elements>
        ) : (
          <EmailStep onReady={setClientSecret} />
        )}

        <Link href="/" className="text-center text-sm text-muted hover:text-foreground transition-colors">
          {t.subscribe.back}
        </Link>
      </div>
    </div>
  );
}
