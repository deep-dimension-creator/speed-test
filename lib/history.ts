import type { TestResult } from "./types";

const STORAGE_KEY = "netpulse-results-v1";
const HISTORY_EVENT = "netpulse-history-change";

export function loadResults(): TestResult[] {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as TestResult[]) : [];
  } catch {
    return [];
  }
}

export function saveResult(result: TestResult) {
  try {
    const results = [result, ...loadResults()].slice(0, 100);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    return;
  }
}

export function clearResults() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event(HISTORY_EVENT));
}

export function subscribeToHistory(callback: () => void) {
  window.addEventListener(HISTORY_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(HISTORY_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}
