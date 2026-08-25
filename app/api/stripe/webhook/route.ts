import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2022-11-15",
});

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret تنظیم نشده است." }, { status: 500 });
  }

  const buf = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature") || "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(buf), sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: "امضای وبهوک نامعتبر است." }, { status: 400 });
  }

  // Handle the event types you care about
  switch (event.type) {
    case "checkout.session.completed":
      // می‌توانید اینجا کارهای مربوط به فعال‌سازی اشتراک یا ذخیره اطلاعات مشتری را انجام دهید.
      break;
    case "invoice.payment_succeeded":
      break;
    case "customer.subscription.updated":
      break;
    case "customer.subscription.deleted":
      break;
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
