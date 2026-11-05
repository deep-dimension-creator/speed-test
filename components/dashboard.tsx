"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowRight, Check, ChevronRight, CircleAlert, Clock3, Database,
  Download, Gauge, LoaderCircle, Play, RotateCcw, Timer, Waves, Zap,
} from "lucide-react";
import { formatBytes, formatTime, loadResults, saveResult, subscribeToHistory } from "@/lib/history";
import { getPageMetrics, observeWebVitals, runSpeedTest } from "@/lib/performance";
import type { PageMetrics, TestProgress, TestResult } from "@/lib/types";
import { LatencyChart } from "./latency-chart";
import { MetricCard } from "./metric-card";

const emptyPage: PageMetrics = { ttfb: null, fcp: null, lcp: null, cls: null, loadedBytes: 0 };

function getScore(result: TestResult | null) {
  if (!result) return 0;
  const latencyScore = Math.max(0, Math.min(50, 50 - Math.max(0, result.latency - 30) / 5));
  const speedScore = Math.max(0, Math.min(40, result.downloadMbps / 2.5));
  const stabilityScore = Math.max(0, 10 - result.jitter / 5);
  return Math.round(latencyScore + speedScore + stabilityScore);
}

function scoreLabel(score: number) {
  if (score >= 85) return "体验优秀";
  if (score >= 70) return "体验良好";
  if (score >= 50) return "体验一般";
  return "有待优化";
}

export function Dashboard() {
  const [result, setResult] = useState<TestResult | null>(null);
  const [history, setHistory] = useState<TestResult[]>([]);
  const [page, setPage] = useState<PageMetrics>(emptyPage);
  const [rounds, setRounds] = useState(5);
  const [payloadMb, setPayloadMb] = useState(5);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<TestProgress | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    observeWebVitals();
    const refresh = () => setHistory(loadResults());
    const unsubscribe = subscribeToHistory(refresh);
    refresh();
    const timer = window.setTimeout(() => setPage(getPageMetrics()), 1200);
    return () => {
      unsubscribe();
      window.clearTimeout(timer);
    };
  }, []);

  const score = useMemo(() => getScore(result), [result]);
  const liveLatency = progress?.phase === "latency" ? progress.value : undefined;
  const displayLatency = liveLatency ?? result?.latency;
  const progressPercent = running
    ? progress?.phase === "download" ? 72 : Math.round(((progress?.current ?? 0) / rounds) * 60)
    : result ? 100 : 0;

  async function startTest() {
    if (running) return;
    setRunning(true);
    setError("");
    setProgress(null);
    try {
      const nextResult = await runSpeedTest({ rounds, payloadMb }, setProgress);
      setResult(nextResult);
      saveResult(nextResult);
      setPage(getPageMetrics());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "检测失败，请检查网络后重试");
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="dashboard-page">
      <section className="page-heading">
        <div>
          <div className="eyebrow">REAL USER EXPERIENCE</div>
          <h1>体验总览</h1>
          <p>从当前浏览器出发，感知服务的真实速度与稳定性。</p>
        </div>
        <Link href="/lab" className="secondary-button">进入负载实验室<ArrowRight size={16} /></Link>
      </section>

      <section className="hero-panel" id="speed-test">
        <div className="hero-grid" />
        <div className="hero-copy">
          <span className="hero-tag"><Zap size={14} />一键体验检测</span>
          <h2>每一次加载，<br />都有据可依。</h2>
          <p>通过真实请求测量延迟、下载与页面性能，<br className="desktop-only" />让网络体验不再只是主观感受。</p>
          <button className="primary-button hero-button" onClick={startTest} disabled={running}>
            {running ? <LoaderCircle className="spin" size={19} /> : result ? <RotateCcw size={18} /> : <Play size={18} fill="currentColor" />}
            {running ? "正在检测网络…" : result ? "重新检测" : "开始体验检测"}
            {!running && <ChevronRight size={17} />}
          </button>
          <div className="hero-footnote"><Check size={14} />无需登录<span />预计消耗 {payloadMb} MB 流量</div>
        </div>
        <div className="score-section">
          <div className={`score-ring ${running ? "is-running" : ""}`} style={{ "--score": `${result ? score * 3.6 : progressPercent * 3.6}deg` } as React.CSSProperties}>
            <div className="score-ring-inner">
              <span className="score-caption">{running ? "检测进度" : "体验评分"}</span>
              <strong>{running ? progressPercent : result ? score : "—"}<small>{running || result ? (running ? "%" : "") : ""}</small></strong>
              <span className="score-status">{running ? progress?.phase === "download" ? "正在测量下载" : "正在测量延迟" : result ? scoreLabel(score) : "等待检测"}</span>
            </div>
          </div>
          <div className="score-legend"><span className={result ? "legend-dot good" : "legend-dot"} />{result ? "基于本次检测综合计算" : "开始检测以获取综合评分"}</div>
        </div>
      </section>

      {error && <div className="error-banner" role="alert"><CircleAlert size={18} />{error}<button onClick={startTest}>重试</button></div>}

      <section className="metrics-grid" aria-label="核心体验指标">
        <MetricCard label="网络延迟" value={displayLatency === undefined ? "—" : displayLatency.toFixed(0)} unit="ms" detail={result ? `抖动 ${result.jitter.toFixed(1)} ms · ${rounds} 次采样` : running ? "正在进行多轮探测" : "多次请求的中位数"} icon={Timer} tone="violet" live={running} />
        <MetricCard label="下载速度" value={result ? result.downloadMbps.toFixed(1) : "—"} unit="Mbps" detail={result ? `约 ${(result.downloadMbps / 8).toFixed(2)} MB/s` : `${payloadMb} MB 随机数据实测`} icon={Download} tone="blue" />
        <MetricCard label="页面加载量" value={formatBytes(result?.loadedBytes ?? page.loadedBytes).split(" ")[0]} unit={formatBytes(result?.loadedBytes ?? page.loadedBytes).split(" ")[1]} detail="页面资源与测试载荷" icon={Database} tone="orange" />
        <MetricCard label="首字节时间" value={page.ttfb === null ? "—" : page.ttfb.toFixed(0)} unit="ms" detail={page.fcp ? `FCP ${(page.fcp / 1000).toFixed(2)} s` : "TTFB · 导航请求"} icon={Clock3} tone="green" />
      </section>

      <section className="dashboard-grid">
        <article className="panel chart-panel">
          <div className="panel-header">
            <div><h3>延迟趋势</h3><p>最近 {Math.min(history.length, 10)} 次检测 · 单位 ms</p></div>
            <span className="panel-chip"><Waves size={14} />P50 延迟</span>
          </div>
          <LatencyChart results={history} />
        </article>

        <article className="panel settings-panel">
          <div className="panel-header"><div><h3>检测设置</h3><p>按当前网络自由调整</p></div><Gauge size={19} /></div>
          <div className="setting-group">
            <label>延迟采样次数</label>
            <div className="segmented-control">
              {[3, 5, 10].map((value) => <button key={value} className={rounds === value ? "selected" : ""} onClick={() => setRounds(value)} disabled={running}>{value} 次</button>)}
            </div>
          </div>
          <div className="setting-group">
            <label>下载测试载荷</label>
            <div className="segmented-control">
              {[2, 5, 10].map((value) => <button key={value} className={payloadMb === value ? "selected" : ""} onClick={() => setPayloadMb(value)} disabled={running}>{value} MB</button>)}
            </div>
          </div>
          <div className="settings-summary"><Activity size={16} /><span>预计耗时</span><strong>{Math.max(2, Math.ceil(rounds * 0.4 + payloadMb / 10))}–{rounds + payloadMb + 5} 秒</strong></div>
          <button className="secondary-button full-width" onClick={startTest} disabled={running}>{running ? "检测中…" : "应用设置并检测"}<ArrowRight size={16} /></button>
        </article>
      </section>

      <section className="panel recent-panel">
        <div className="panel-header">
          <div><h3>最近检测</h3><p>仅保留当前浏览器中的记录</p></div>
          <Link href="/history" className="text-link">全部记录<ChevronRight size={15} /></Link>
        </div>
        {history.length ? (
          <div className="table-scroll">
            <table>
              <thead><tr><th>检测时间</th><th>网络延迟</th><th>下载速度</th><th>加载量</th><th>体验评分</th></tr></thead>
              <tbody>{history.slice(0, 3).map((item) => (
                <tr key={item.id}>
                  <td>{formatTime(item.createdAt)}</td><td>{item.latency.toFixed(0)} ms</td><td>{item.downloadMbps.toFixed(1)} Mbps</td><td>{formatBytes(item.loadedBytes)}</td>
                  <td><span className={`score-pill ${getScore(item) >= 70 ? "good" : ""}`}>{getScore(item)} 分</span></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        ) : (
          <div className="empty-row"><Activity size={20} /><span>还没有检测记录</span><button onClick={startTest}>立即开始第一次检测</button></div>
        )}
      </section>
    </div>
  );
}
