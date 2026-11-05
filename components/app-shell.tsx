"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Activity, BookOpen, Boxes, Gauge, History, Radio, ShieldCheck } from "lucide-react";

const navigation = [
  { href: "/", label: "页面体验", icon: BookOpen },
  { href: "/dashboard", label: "数据看板", icon: Gauge },
  { href: "/dashboard#speed-test", label: "实时测速", icon: Activity },
  { href: "/lab", label: "负载实验室", icon: Boxes },
  { href: "/history", label: "历史记录", icon: History },
];

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const [host] = useState(() => typeof window === "undefined" ? "当前部署节点" : window.location.host);

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="NetPulse 首页">
          <span className="brand-mark"><Radio size={22} strokeWidth={2.4} /></span>
          <span>NetPulse<span className="brand-dot">.</span></span>
        </Link>
        <div className="nav-caption">工作台</div>
        <nav className="main-nav" aria-label="主导航">
          {navigation.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : !href.includes("#") && pathname === href;
            return (
              <Link key={href} href={href} className={active ? "nav-link active" : "nav-link"}>
                <Icon size={19} />
                <span>{label}</span>
                {active && <span className="active-indicator" />}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-spacer" />
        <div className="node-card">
          <div className="node-card-title"><span className="status-dot" />节点已连接</div>
          <strong title={host} suppressHydrationWarning>{host}</strong>
          <span>当前网站服务节点</span>
        </div>
        <div className="privacy-note"><ShieldCheck size={16} />数据仅保存在此浏览器</div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <Link className="mobile-brand" href="/"><Radio size={20} />NetPulse<span>.</span></Link>
          <div className="topbar-breadcrumb">网络体验监测 <span>/</span> 国内用户</div>
          <div className="topbar-right">
            <span className="live-badge"><span className="status-dot" />浏览器端实测</span>
            <div className="avatar">NP</div>
          </div>
        </header>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
