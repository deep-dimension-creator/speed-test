export interface TestConfig {
  rounds: number;
  payloadMb: number;
}

export interface TestResult {
  id: string;
  createdAt: string;
  latency: number;
  minLatency: number;
  maxLatency: number;
  jitter: number;
  downloadMbps: number;
  downloadedBytes: number;
  loadedBytes: number;
  duration: number;
  ttfb: number | null;
  fcp: number | null;
  lcp: number | null;
  cls: number | null;
  samples: number[];
  payloadMb: number;
}

export interface PageMetrics {
  ttfb: number | null;
  fcp: number | null;
  lcp: number | null;
  cls: number | null;
  loadedBytes: number;
}

export interface TestProgress {
  phase: "latency" | "download" | "complete";
  current: number;
  total: number;
  value?: number;
}
