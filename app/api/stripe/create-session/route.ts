import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-08-01",
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const priceId = body?.priceId || process.env.STRIPE_PRICE_ID;

  if (!priceId) {
    return NextResponse.json({ error: "Price ID تنظیم نشده است." }, { status: 400 });
  }

  try {
    const url = new URL(req.url);
    const origin = url.origin;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/subscribe?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/subscribe?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطای داخلی سرور";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
