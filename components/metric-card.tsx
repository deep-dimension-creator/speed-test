import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  icon: LucideIcon;
  tone: "violet" | "blue" | "orange" | "green";
  live?: boolean;
}

export function MetricCard({ label, value, unit, detail, icon: Icon, tone, live }: MetricCardProps) {
  return (
    <article className="metric-card">
      <div className="metric-card-top">
        <span className={`metric-icon ${tone}`}><Icon size={20} /></span>
        {live && <span className="metric-live"><span className="status-dot" />实时</span>}
      </div>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}<span>{unit}</span></div>
      <div className="metric-detail">{detail}</div>
    </article>
  );
}
