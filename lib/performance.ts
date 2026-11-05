import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import type { PageMetrics, TestConfig, TestProgress, TestResult } from "./types";

const latestVitals: Partial<Record<"fcp" | "lcp" | "cls", number>> = {};

export function observeWebVitals() {
  onLCP(({ value }) => {
    latestVitals.lcp = value;
  });
  onCLS(({ value }) => {
    latestVitals.cls = value;
  });
  onINP(() => undefined);
  onFCP(({ value }) => {
    latestVitals.fcp = value;
  });
  onTTFB(() => undefined);
}

export function getPageMetrics(): PageMetrics {
  if (typeof performance === "undefined") {
    return { ttfb: null, fcp: null, lcp: null, cls: null, loadedBytes: 0 };
  }

  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
  const firstPaint = performance.getEntriesByName("first-contentful-paint")[0];
  const resourceBytes = resources.reduce((total, entry) => {
    return total + (entry.encodedBodySize || entry.transferSize || 0);
  }, 0);

  return {
    ttfb: navigation ? navigation.responseStart - navigation.startTime : null,
    fcp: firstPaint?.startTime ?? latestVitals.fcp ?? null,
    lcp: latestVitals.lcp ?? null,
    cls: latestVitals.cls ?? null,
    loadedBytes: (navigation?.encodedBodySize || 0) + resourceBytes,
  };
}

async function fetchWithTimeout(url: string, timeout: number) {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(url, { cache: "no-store", signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

export async function runSpeedTest(
  config: TestConfig,
  onProgress: (progress: TestProgress) => void,
): Promise<TestResult> {
  const startedAt = performance.now();
  const page = getPageMetrics();
  const samples: number[] = [];

  for (let index = 0; index < config.rounds; index += 1) {
    const requestStartedAt = performance.now();
    const response = await fetchWithTimeout(`/api/ping?t=${Date.now()}-${index}`, 10_000);
    if (!response.ok) throw new Error(`延迟检测请求失败（${response.status}）`);
    await response.arrayBuffer();
    const latency = performance.now() - requestStartedAt;
    samples.push(latency);
    onProgress({ phase: "latency", current: index + 1, total: config.rounds, value: latency });
  }

  onProgress({ phase: "download", current: 0, total: 1 });
  const downloadStartedAt = performance.now();
  const response = await fetchWithTimeout(`/api/payload?size=${config.payloadMb * 1024 * 1024}&t=${Date.now()}`, 45_000);
  if (!response.ok) throw new Error(`下载检测请求失败（${response.status}）`);
  const payload = await response.arrayBuffer();
  const downloadSeconds = Math.max((performance.now() - downloadStartedAt) / 1000, 0.001);
  onProgress({ phase: "download", current: 1, total: 1 });

  const jitter = samples.length > 1
    ? samples.slice(1).reduce((sum, value, index) => sum + Math.abs(value - samples[index]), 0) / (samples.length - 1)
    : 0;

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    latency: median(samples),
    minLatency: Math.min(...samples),
    maxLatency: Math.max(...samples),
    jitter,
    downloadMbps: (payload.byteLength * 8) / downloadSeconds / 1_000_000,
    downloadedBytes: payload.byteLength,
    loadedBytes: page.loadedBytes + payload.byteLength,
    duration: (performance.now() - startedAt) / 1000,
    ttfb: page.ttfb,
    fcp: page.fcp,
    lcp: page.lcp,
    cls: page.cls,
    samples,
    payloadMb: config.payloadMb,
  };
}
