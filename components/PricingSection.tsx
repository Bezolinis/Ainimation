"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n";

export default function PricingSection() {
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
    <section className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 pt-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold">
          <span className="gradient-text">{t.pricing.title}</span>
        </h2>
        <p className="text-muted max-w-lg">{t.pricing.subtitle}</p>
      </div>

      <div className="card w-full p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-end justify-center gap-1">
          <span className="text-4xl font-bold">{t.pricing.price}</span>
          <span className="text-muted mb-1">{t.pricing.period}</span>
        </div>

        <ul className="flex flex-col gap-3">
          {t.pricing.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 border border-primary text-primary flex items-center justify-center text-xs">
                ✓
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full rounded-xl py-3.5 font-semibold text-white bg-gradient-to-l from-primary to-primary-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {loading ? t.pricing.loading : t.pricing.cta}
        </button>

        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <p className="text-xs text-muted text-center">{t.pricing.secure}</p>
      </div>
    </section>
  );
}
