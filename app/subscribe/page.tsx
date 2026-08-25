"use client";

import { useState } from "react";

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
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h1>خرید اشتراک ماهانه</h1>
      <p>با کلیک روی دکمه‌ی زیر به صفحه‌ی پرداخت Stripe منتقل می‌شوید.</p>
      <button onClick={handleSubscribe} disabled={loading} style={{ padding: "10px 18px", fontSize: 16 }}>
        {loading ? "در حال هدایت..." : "مشترک شدن - ماهیانه"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
