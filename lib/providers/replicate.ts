import { GenerationJob, GenerationOptions, VideoProvider } from "./types";

const API_BASE = "https://api.replicate.com/v1";

const jobs = new Map<string, GenerationJob>();
// Maps our internal job id -> Replicate prediction id.
const predictionIds = new Map<string, string>();

function headers() {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token) {
    throw new Error(
      "REPLICATE_API_TOKEN تنظیم نشده. آن را در فایل .env.local قرار بده."
    );
  }
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const replicateProvider: VideoProvider = {
  name: "replicate",

  async startGeneration(options: GenerationOptions) {
    const modelVersion = process.env.REPLICATE_MODEL_VERSION;
    if (!modelVersion) {
      throw new Error(
        "REPLICATE_MODEL_VERSION تنظیم نشده. شناسه مدل متن‌به‌ویدیوی موردنظرت را در .env.local بگذار."
      );
    }

    const res = await fetch(`${API_BASE}/predictions`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        version: modelVersion,
        input: {
          prompt: options.prompt,
        },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`خطای Replicate: ${res.status} ${text}`);
    }

    const data = await res.json();
    const id = crypto.randomUUID();

    jobs.set(id, {
      id,
      status: "queued",
      progress: 5,
      prompt: options.prompt,
      createdAt: Date.now(),
    });
    predictionIds.set(id, data.id);

    return id;
  },

  async getJob(jobId: string) {
    const job = jobs.get(jobId);
    const predictionId = predictionIds.get(jobId);
    if (!job || !predictionId) return undefined;

    if (job.status === "completed" || job.status === "failed") {
      return job;
    }

    const res = await fetch(`${API_BASE}/predictions/${predictionId}`, {
      headers: headers(),
    });

    if (!res.ok) {
      job.status = "failed";
      job.error = `خطای Replicate: ${res.status}`;
      return job;
    }

    const data = await res.json();

    if (data.status === "succeeded") {
      job.status = "completed";
      job.progress = 100;
      job.videoUrl = Array.isArray(data.output) ? data.output[0] : data.output;
    } else if (data.status === "failed" || data.status === "canceled") {
      job.status = "failed";
      job.error = data.error ?? "تولید ویدیو با خطا مواجه شد.";
    } else {
      job.status = "processing";
      job.progress = Math.min(90, job.progress + 10);
    }

    return job;
  },
};
