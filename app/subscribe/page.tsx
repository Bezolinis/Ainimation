"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SubscribeStatus() {
  const params = useSearchParams();
  const success = params.get("success");
  const canceled = params.get("canceled");

  if (success) {
    return (
      <p className="text-sm text-center rounded-xl border border-primary bg-primary/10 px-4 py-3">
        پرداخت با موفقیت انجام شد. اشتراک ماهانه‌ات فعال شد. 🎉
      </p>
    );
  }
  if (canceled) {
    return (
      <p className="text-sm text-center rounded-xl border border-border px-4 py-3 text-muted">
        پرداخت لغو شد. هر وقت خواستی می‌تونی دوباره اقدام کنی.
      </p>
    );
  }
  return null;
}

export default function SubscribePage() {
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
      setError(data?.error || "خطا در ایجاد سشن پرداخت");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای شبکه");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center px-4 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">
            <span className="gradient-text">خرید اشتراک ماهانه</span>
          </h1>
          <p className="text-muted text-sm">
            با کلیک روی دکمه‌ی زیر به صفحه‌ی پرداخت Stripe منتقل می‌شوی.
          </p>
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
            {loading ? "در حال هدایت..." : "مشترک شدن - ماهیانه"}
          </button>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        </div>

        <Link href="/" className="text-center text-sm text-muted hover:text-foreground transition-colors">
          بازگشت به صفحه اصلی
        </Link>
      </div>
    </div>
  );
}
