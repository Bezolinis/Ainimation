import { GenerationJob, GenerationOptions, VideoProvider } from "./types";

const jobs = new Map<string, GenerationJob>();

const SAMPLE_VIDEO_URL =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";

function tick(jobId: string) {
  const job = jobs.get(jobId);
  if (!job || job.status === "completed" || job.status === "failed") return;

  job.status = "processing";
  job.progress = Math.min(95, job.progress + Math.random() * 20 + 10);

  if (job.progress >= 95) {
    job.status = "completed";
    job.progress = 100;
    job.videoUrl = SAMPLE_VIDEO_URL;
    return;
  }

  setTimeout(() => tick(jobId), 900);
}

export const mockProvider: VideoProvider = {
  name: "mock",

  async startGeneration(options: GenerationOptions) {
    const id = crypto.randomUUID();
    jobs.set(id, {
      id,
      status: "queued",
      progress: 0,
      prompt: options.prompt,
      createdAt: Date.now(),
    });
    setTimeout(() => tick(id), 700);
    return id;
  },

  async getJob(jobId: string) {
    return jobs.get(jobId);
  },
};
