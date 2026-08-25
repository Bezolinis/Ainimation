import { GenerationJob, GenerationOptions, VideoProvider } from "./types";

const API_BASE = "https://app-api.pixverse.ai/openapi/v2";

const jobs = new Map<string, GenerationJob>();
// Maps our internal job id -> PixVerse video_id.
const videoIds = new Map<string, number>();

function headers() {
  const apiKey = process.env.PIXVERSE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "PIXVERSE_API_KEY تنظیم نشده. آن را در فایل .env.local قرار بده."
    );
  }
  return {
    "API-KEY": apiKey,
    "Ai-trace-id": crypto.randomUUID(),
    "Content-Type": "application/json",
  };
}

export const pixverseProvider: VideoProvider = {
  name: "pixverse",

  async startGeneration(options: GenerationOptions) {
    const res = await fetch(`${API_BASE}/video/text/generate`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        prompt: options.prompt,
        aspect_ratio: options.aspectRatio ?? "16:9",
        duration: options.durationSeconds ?? 5,
        model: process.env.PIXVERSE_MODEL ?? "v4.5",
        quality: process.env.PIXVERSE_QUALITY ?? "540p",
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`خطای PixVerse: ${res.status} ${text}`);
    }

    const data = await res.json();
    if (data.ErrCode !== 0) {
      throw new Error(`خطای PixVerse: ${data.ErrMsg ?? "خطای ناشناخته"}`);
    }

    const id = crypto.randomUUID();
    jobs.set(id, {
      id,
      status: "queued",
      progress: 5,
      prompt: options.prompt,
      createdAt: Date.now(),
    });
    videoIds.set(id, data.Resp.video_id);

    return id;
  },

  async getJob(jobId: string) {
    const job = jobs.get(jobId);
    const videoId = videoIds.get(jobId);
    if (!job || videoId === undefined) return undefined;

    if (job.status === "completed" || job.status === "failed") {
      return job;
    }

    const res = await fetch(`${API_BASE}/video/result/${videoId}`, {
      headers: headers(),
    });

    if (!res.ok) {
      job.status = "failed";
      job.error = `خطای PixVerse: ${res.status}`;
      return job;
    }

    const data = await res.json();
    if (data.ErrCode !== 0) {
      job.status = "failed";
      job.error = data.ErrMsg ?? "تولید ویدیو با خطا مواجه شد.";
      return job;
    }

    const status = data.Resp.status;
    if (status === 1) {
      job.status = "completed";
      job.progress = 100;
      job.videoUrl = data.Resp.url;
    } else if (status === 7) {
      job.status = "failed";
      job.error = "محتوای درخواستی رد شد (نقض قوانین محتوا).";
    } else if (status === 8) {
      job.status = "failed";
      job.error = "تولید ویدیو ناموفق بود.";
    } else {
      job.status = "processing";
      job.progress = Math.min(90, job.progress + 10);
    }

    return job;
  },
};
