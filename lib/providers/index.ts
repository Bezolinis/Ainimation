import { VideoProvider } from "./types";
import { mockProvider } from "./mock";
import { replicateProvider } from "./replicate";

export function getProvider(): VideoProvider {
  const providerName = process.env.VIDEO_PROVIDER ?? "mock";

  switch (providerName) {
    case "replicate":
      return replicateProvider;
    case "mock":
    default:
      return mockProvider;
  }
}

export * from "./types";
