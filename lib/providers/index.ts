import { VideoProvider } from "./types";
import { mockProvider } from "./mock";
import { replicateProvider } from "./replicate";
import { pixverseProvider } from "./pixverse";

export function getProvider(): VideoProvider {
  const providerName = process.env.VIDEO_PROVIDER ?? "mock";

  switch (providerName) {
    case "replicate":
      return replicateProvider;
    case "pixverse":
      return pixverseProvider;
    case "mock":
    default:
      return mockProvider;
  }
}

export * from "./types";
