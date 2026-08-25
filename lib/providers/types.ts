export type GenerationStatus = "queued" | "processing" | "completed" | "failed";

export interface GenerationOptions {
  prompt: string;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  durationSeconds?: number;
}

export interface GenerationJob {
  id: string;
  status: GenerationStatus;
  progress: number;
  prompt: string;
  videoUrl?: string;
  error?: string;
  createdAt: number;
}

export interface VideoProvider {
  name: string;
  /** Kicks off a generation job and returns its id. */
  startGeneration(options: GenerationOptions): Promise<string>;
  /** Returns the current state of a previously started job. */
  getJob(jobId: string): Promise<GenerationJob | undefined>;
}
