"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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

export default function SubscribePage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
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

        <div className="card p-6 flex flex-col gap-4">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full rounded-xl py-3.5 font-semibold text-white bg-gradient-to-l from-primary to-primary-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
          >
            {loading ? t.subscribe.loading : t.subscribe.cta}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        <Link href="/" className="text-center text-sm text-muted hover:text-foreground transition-colors">
          {t.subscribe.back}
        </Link>
      </div>
    </div>
  );
}
