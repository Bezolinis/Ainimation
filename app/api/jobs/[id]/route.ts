import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/lib/providers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const provider = getProvider();
    const job = await provider.getJob(id);

    if (!job) {
      return NextResponse.json({ error: "کاری با این شناسه پیدا نشد." }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (err) {
    const message = err instanceof Error ? err.message : "خطای ناشناخته";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
