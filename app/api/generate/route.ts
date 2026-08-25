import { NextRequest, NextResponse } from "next/server";
import { getProvider, GenerationOptions } from "@/lib/providers";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const prompt = typeof body?.prompt === "string" ? body.prompt.trim() : "";
  const aspectRatio: GenerationOptions["aspectRatio"] = ["16:9", "9:16", "1:1"].includes(
    body?.aspectRatio
  )
    ? body.aspectRatio
    : undefined;

  if (!prompt) {
    return NextResponse.json(
      { error: "متن (prompt) نمی‌تواند خالی باشد." },
      { status: 400 }
    );
  }

  if (prompt.length > 1000) {
    return NextResponse.json(
      { error: "متن باید کمتر از ۱۰۰۰ کاراکتر باشد." },
      { status: 400 }
    );
  }

  try {
    const provider = getProvider();
    const jobId = await provider.startGeneration({ prompt, aspectRatio });
    return NextResponse.json({ jobId, provider: provider.name });
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطای ناشناخته";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
