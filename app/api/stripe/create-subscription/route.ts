import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const priceId = body?.priceId || process.env.STRIPE_PRICE_ID;

  if (!email) {
    return NextResponse.json({ error: "ایمیل الزامی است." }, { status: 400 });
  }
  if (!priceId) {
    return NextResponse.json({ error: "Price ID تنظیم نشده است." }, { status: 400 });
  }

  try {
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer = existing.data[0] ?? (await stripe.customers.create({ email }));

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    if (!paymentIntent?.client_secret) {
      return NextResponse.json({ error: "ایجاد پرداخت با خطا مواجه شد." }, { status: 500 });
    }

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطای داخلی سرور";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
