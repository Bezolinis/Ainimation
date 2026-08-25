"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";

type Status = "idle" | "queued" | "processing" | "completed" | "failed";
type AspectRatio = "16:9" | "9:16" | "1:1";

interface HistoryItem {
  id: string;
  prompt: string;
  videoUrl: string;
}

const ASPECT_RATIO_VALUES: AspectRatio[] = ["16:9", "9:16", "1:1"];

export default function GenerateForm() {
  const { t } = useLanguage();
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  function pollJob(jobId: string, currentPrompt: string) {
    pollRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        const data = await res.json();

        if (!res.ok) {
          setStatus("failed");
          setError(data.error ?? t.form.errorGeneric);
          return;
        }

        setStatus(data.status);
        setProgress(data.progress ?? 0);

        if (data.status === "completed" && data.videoUrl) {
          setVideoUrl(data.videoUrl);
          setHistory((prev) => [
            { id: jobId, prompt: currentPrompt, videoUrl: data.videoUrl },
            ...prev,
          ]);
        } else if (data.status === "failed") {
          setError(data.error ?? t.form.errorFailed);
        } else {
          pollJob(jobId, currentPrompt);
        }
      } catch {
        setStatus("failed");
        setError(t.form.errorNetwork);
      }
    }, 1000);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || status === "queued" || status === "processing") return;

    setError(null);
    setVideoUrl(null);
    setProgress(0);
    setStatus("queued");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("failed");
        setError(data.error ?? t.form.errorGeneric);
        return;
      }

      pollJob(data.jobId, prompt);
    } catch {
      setStatus("failed");
      setError(t.form.errorNetwork);
    }
  }

  const isBusy = status === "queued" || status === "processing";

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="card p-6 sm:p-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="prompt" className="text-sm text-muted">
            {t.form.label}
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.form.placeholder}
            rows={4}
            maxLength={1000}
            className="w-full resize-none rounded-xl bg-surface-2 border border-border px-4 py-3 text-base outline-none focus:border-primary transition-colors placeholder:text-muted"
          />
          <div className="flex flex-wrap gap-2 pt-1">
            {t.form.suggestions.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setPrompt(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:text-foreground hover:border-primary transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-muted">{t.form.aspectRatioLabel}</span>
          <div className="flex gap-2">
            {ASPECT_RATIO_VALUES.map((ratio) => (
              <button
                type="button"
                key={ratio}
                onClick={() => setAspectRatio(ratio)}
                className={`px-4 py-2 rounded-xl text-sm border transition-colors ${
                  aspectRatio === ratio
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                {t.form.aspectRatios[ratio]}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={!prompt.trim() || isBusy}
          className="mt-2 w-full rounded-xl py-3.5 font-semibold text-white bg-gradient-to-l from-primary to-primary-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          {isBusy ? t.form.submitBusy : t.form.submitIdle}
        </button>
      </form>

      {(isBusy || status === "completed" || status === "failed") && (
        <div className="card p-6 sm:p-8 flex flex-col items-center gap-4">
          {isBusy && (
            <>
              <div className="w-14 h-14 rounded-full border-4 border-border border-t-primary animate-spin-slow" />
              <p className="text-muted animate-pulse-glow">
                {status === "queued" ? t.form.statusQueued : t.form.statusProcessing}
              </p>
              <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-primary to-primary-2 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          )}

          {status === "failed" && error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          {status === "completed" && videoUrl && (
            <div className="w-full flex flex-col gap-4">
              <video
                src={videoUrl}
                controls
                autoPlay
                loop
                className="w-full rounded-xl border border-border"
              />
              <a
                href={videoUrl}
                download
                className="text-center rounded-xl py-3 border border-border hover:border-primary transition-colors text-sm"
              >
                {t.form.download}
              </a>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm text-muted">{t.form.historyTitle}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {history.map((item) => (
              <div key={item.id} className="card overflow-hidden">
                <video src={item.videoUrl} className="w-full aspect-video object-cover" muted />
                <p className="text-xs text-muted p-2 truncate" title={item.prompt}>
                  {item.prompt}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
