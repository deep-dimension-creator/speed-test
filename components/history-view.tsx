"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, Download, FileDown, Gauge, Trash2 } from "lucide-react";
import { clearResults, formatBytes, formatTime, loadResults, subscribeToHistory } from "@/lib/history";
import type { TestResult } from "@/lib/types";

export function HistoryView() {
  const [results, setResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const refresh = () => setResults(loadResults());
    refresh();
    return subscribeToHistory(refresh);
  }, []);

  const summary = useMemo(() => {
    if (!results.length) return null;
    const average = (key: "latency" | "downloadMbps") => results.reduce((sum, item) => sum + item[key], 0) / results.length;
    const sorted = results.map((item) => item.latency).sort((a, b) => a - b);
    return {
      averageLatency: average("latency"),
      averageSpeed: average("downloadMbps"),
      p95: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))],
    };
  }, [results]);

  function exportCsv() {
    const header = ["检测时间", "延迟(ms)", "最低延迟(ms)", "最高延迟(ms)", "抖动(ms)", "下载速度(Mbps)", "加载量(bytes)", "TTFB(ms)", "FCP(ms)", "载荷(MB)"];
    const rows = results.map((item) => [item.createdAt, item.latency, item.minLatency, item.maxLatency, item.jitter, item.downloadMbps, item.loadedBytes, item.ttfb ?? "", item.fcp ?? "", item.payloadMb]);
    const csv = `\uFEFF${[header, ...rows].map((row) => row.join(",")).join("\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `netpulse-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <section className="page-heading">
        <div><div className="eyebrow">LOCAL TEST ARCHIVE</div><h1>历史记录</h1><p>回看当前浏览器中的检测结果，观察网络体验的波动。</p></div>
        <div className="heading-actions">
          <button className="secondary-button" onClick={exportCsv} disabled={!results.length}><FileDown size={16} />导出 CSV</button>
          <button className="icon-button danger" aria-label="清空历史记录" title="清空历史记录" disabled={!results.length} onClick={() => { if (window.confirm("确定清空当前浏览器中的全部检测记录吗？")) clearResults(); }}><Trash2 size={18} /></button>
        </div>
      </section>

      <section className="history-summary">
        <div><span className="summary-icon violet"><Activity size={20} /></span><p>累计检测<strong>{results.length}<small> 次</small></strong></p></div>
        <div><span className="summary-icon blue"><Gauge size={20} /></span><p>平均延迟<strong>{summary ? summary.averageLatency.toFixed(0) : "—"}<small> ms</small></strong></p></div>
        <div><span className="summary-icon green"><Download size={20} /></span><p>平均下载<strong>{summary ? summary.averageSpeed.toFixed(1) : "—"}<small> Mbps</small></strong></p></div>
        <div><span className="summary-icon orange"><Activity size={20} /></span><p>P95 延迟<strong>{summary ? summary.p95.toFixed(0) : "—"}<small> ms</small></strong></p></div>
      </section>

      <section className="panel history-table-panel">
        <div className="panel-header"><div><h3>全部检测</h3><p>最多保存最近 100 次记录</p></div><Link href="/dashboard#speed-test" className="secondary-button">新建检测</Link></div>
        {results.length ? (
          <div className="table-scroll"><table><thead><tr><th>检测时间</th><th>延迟 / 抖动</th><th>延迟范围</th><th>下载速度</th><th>总加载量</th><th>首字节</th><th>测试载荷</th></tr></thead>
            <tbody>{results.map((item) => <tr key={item.id}>
              <td>{formatTime(item.createdAt)}</td>
              <td><strong>{item.latency.toFixed(0)} ms</strong><span className="table-subvalue">抖动 {item.jitter.toFixed(1)} ms</span></td>
              <td>{item.minLatency.toFixed(0)}–{item.maxLatency.toFixed(0)} ms</td>
              <td>{item.downloadMbps.toFixed(1)} Mbps</td><td>{formatBytes(item.loadedBytes)}</td><td>{item.ttfb === null ? "—" : `${item.ttfb.toFixed(0)} ms`}</td><td>{item.payloadMb} MB</td>
            </tr>)}</tbody></table></div>
        ) : (
          <div className="large-empty"><span><Activity size={30} /></span><h3>暂无检测记录</h3><p>完成一次体验检测后，数据会自动出现在这里。</p><Link className="primary-button" href="/dashboard#speed-test">开始第一次检测</Link></div>
        )}
      </section>
    </div>
  );
}
