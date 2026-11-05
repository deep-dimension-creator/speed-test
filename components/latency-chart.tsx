import type { TestResult } from "@/lib/types";

export function LatencyChart({ results }: { results: TestResult[] }) {
  const data = results.slice(0, 10).reverse();
  const width = 680;
  const height = 210;
  const left = 42;
  const right = 18;
  const top = 20;
  const bottom = 38;
  const values = data.map((item) => item.latency);
  const max = Math.max(...values, 100) * 1.2;
  const x = (index: number) => left + (index / Math.max(data.length - 1, 1)) * (width - left - right);
  const y = (value: number) => top + (1 - value / max) * (height - top - bottom);
  const line = data.map((item, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(item.latency)}`).join(" ");
  const area = data.length > 1 ? `${line} L ${x(data.length - 1)} ${height - bottom} L ${left} ${height - bottom} Z` : "";

  return (
    <div className="chart-wrap">
      <svg className="latency-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="最近十次网络延迟趋势图">
        <defs>
          <linearGradient id="chartArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#635bff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#635bff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.5, 1].map((ratio) => {
          const lineY = top + ratio * (height - top - bottom);
          const value = max * (1 - ratio);
          return (
            <g key={ratio}>
              <line x1={left} x2={width - right} y1={lineY} y2={lineY} className="chart-grid-line" />
              <text x={left - 10} y={lineY + 4} textAnchor="end" className="chart-axis-label">{Math.round(value)}</text>
            </g>
          );
        })}
        {data.length > 0 && <path d={area} fill="url(#chartArea)" />}
        {data.length > 0 && <path d={line} className="chart-line" />}
        {data.map((item, index) => (
          <g key={item.id}>
            <circle cx={x(index)} cy={y(item.latency)} r="5" className="chart-point-halo" />
            <circle cx={x(index)} cy={y(item.latency)} r="3" className="chart-point" />
            <text x={x(index)} y={height - 13} textAnchor="middle" className="chart-axis-label">{index + 1}</text>
          </g>
        ))}
        {data.length === 0 && (
          <text x={width / 2} y={height / 2} textAnchor="middle" className="chart-empty">完成一次检测后，这里将展示延迟趋势</text>
        )}
      </svg>
      <div className="chart-x-caption"><span>较早</span><span>检测次序</span><span>最新</span></div>
    </div>
  );
}
