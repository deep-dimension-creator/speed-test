"use client";

import { useState } from "react";
import { Box, Check, CircleAlert, Database, FileText, Images, LoaderCircle, Play, Timer } from "lucide-react";
import { formatBytes } from "@/lib/history";

interface ContentItem {
  id: number;
  title: string;
  summary: string;
  category: string;
  readingTime: number;
}

interface LabResult {
  name: string;
  duration: number;
  loadedBytes: number;
  requests: number;
  items: ContentItem[];
  images: string[];
}

const scenarios = [
  { id: "article", name: "图文文章", description: "模拟常规内容页，加载文章数据与 4 张配图。", icon: FileText, tone: "violet", images: 4, payloadMb: 0, contentRequests: 1, tag: "轻量负载" },
  { id: "gallery", name: "高清图库", description: "模拟图片密集型站点，并发加载 12 张图片与数据。", icon: Images, tone: "blue", images: 12, payloadMb: 2, contentRequests: 1, tag: "图片负载" },
  { id: "data", name: "数据看板", description: "模拟高负载页面，请求多组数据、图片与 5 MB 载荷。", icon: Database, tone: "orange", images: 6, payloadMb: 5, contentRequests: 3, tag: "综合负载" },
];

function loadImage(src: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("图片加载失败，请重试"));
    image.src = src;
  });
}

async function executeScenario(
  scenario: (typeof scenarios)[number],
  onImageLoaded: (src: string) => void,
): Promise<LabResult> {
  const startedAt = performance.now();
  const token = `${scenario.id}-${Date.now()}`;
  const contentResponses = await Promise.all(Array.from({ length: scenario.contentRequests }, (_, index) =>
    fetch(`/api/content?run=${token}-${index}`, { cache: "no-store" }).then(async (response) => {
      if (!response.ok) throw new Error("内容接口请求失败");
      return response.arrayBuffer();
    })),
  );
  const firstContent = JSON.parse(new TextDecoder().decode(contentResponses[0])) as { items: ContentItem[] };
  const images = Array.from({ length: scenario.images }, (_, index) => `/gallery-${(index % 6) + 1}.svg?run=${token}-${index}`);
  await Promise.all(images.map(async (src) => {
    await loadImage(src);
    onImageLoaded(src);
  }));

  let payloadBytes = 0;
  if (scenario.payloadMb) {
    const response = await fetch(`/api/payload?size=${scenario.payloadMb * 1024 * 1024}&run=${token}`, { cache: "no-store" });
    if (!response.ok) throw new Error("测试载荷下载失败");
    payloadBytes = (await response.arrayBuffer()).byteLength;
  }

  const contentBytes = contentResponses.reduce((sum, buffer) => sum + buffer.byteLength, 0);
  const imageBytes = (performance.getEntriesByType("resource") as PerformanceResourceTiming[])
    .filter((entry) => entry.name.includes(token) && entry.name.includes("/gallery-"))
    .reduce((sum, entry) => sum + (entry.encodedBodySize || entry.transferSize || 0), 0);

  return {
    name: scenario.name,
    duration: performance.now() - startedAt,
    loadedBytes: contentBytes + imageBytes + payloadBytes,
    requests: scenario.contentRequests + scenario.images + (scenario.payloadMb ? 1 : 0),
    items: firstContent.items,
    images,
  };
}

export function LoadLab() {
  const [running, setRunning] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<LabResult | null>(null);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  async function runScenario(scenario: (typeof scenarios)[number]) {
    if (running) return;
    setRunning(scenario.id);
    setError("");
    setResult(null);
    setPreviewImages([]);
    try {
      const nextResult = await executeScenario(scenario, (src) => setPreviewImages((current) => [...current, src]));
      setResult(nextResult);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "场景加载失败，请重试");
    } finally {
      setRunning("");
    }
  }

  return (
    <div className="lab-page">
      <section className="page-heading">
        <div><div className="eyebrow">REAL-WORLD WORKLOADS</div><h1>负载实验室</h1><p>不只是测速，用不同类型的真实页面负载检验访问体验。</p></div>
        <span className="lab-badge"><Box size={16} />3 个标准化场景</span>
      </section>

      <section className="scenario-grid">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isRunning = running === scenario.id;
          return (
            <article className={`scenario-card ${scenario.tone}`} key={scenario.id}>
              <div className="scenario-top"><span className="scenario-icon"><Icon size={24} /></span><span className="scenario-tag">{scenario.tag}</span></div>
              <h2>{scenario.name}</h2><p>{scenario.description}</p>
              <div className="scenario-specs"><span>{scenario.images} 张图片</span><span>{scenario.contentRequests} 组数据</span>{scenario.payloadMb > 0 && <span>{scenario.payloadMb} MB 载荷</span>}</div>
              <button onClick={() => runScenario(scenario)} disabled={Boolean(running)} className="scenario-button">
                {isRunning ? <LoaderCircle className="spin" size={17} /> : <Play size={16} fill="currentColor" />}{isRunning ? "场景加载中…" : "运行此场景"}
              </button>
            </article>
          );
        })}
      </section>

      {error && <div className="error-banner" role="alert"><CircleAlert size={18} />{error}</div>}

      <section className="panel lab-stage">
        <div className="panel-header">
          <div><h3>{result ? `${result.name} · 加载结果` : running ? "正在构建真实页面负载" : "场景运行舞台"}</h3><p>{result ? "所有指标均来自刚才的浏览器请求" : "选择一个场景，观察内容、图片与数据的加载过程"}</p></div>
          {result && <span className="success-badge"><Check size={15} />加载完成</span>}
        </div>

        {running && <div className="lab-loading"><div className="loading-visual"><LoaderCircle className="spin" size={34} /></div><strong>正在请求服务器资源</strong><span>已加载 {previewImages.length} 张图片，请稍候…</span><div className="loading-track"><span /></div></div>}

        {!running && !result && <div className="large-empty lab-empty"><span><Box size={30} /></span><h3>准备就绪</h3><p>运行场景后，这里会渲染实际加载的图片和文字内容。</p></div>}

        {result && !running && (
          <>
            <div className="lab-result-stats">
              <div><Timer size={18} /><span>场景总耗时<strong>{(result.duration / 1000).toFixed(2)} s</strong></span></div>
              <div><Database size={18} /><span>实际加载量<strong>{formatBytes(result.loadedBytes)}</strong></span></div>
              <div><Box size={18} /><span>完成请求<strong>{result.requests} 个</strong></span></div>
            </div>
            <div className="loaded-gallery">
              {result.images.map((src, index) => <div className={`loaded-image image-${(index % 6) + 1}`} key={src} style={{ backgroundImage: `url("${src}")` }} title={`测试图片 ${index + 1}`} />)}
            </div>
            <div className="content-preview">
              <div className="content-preview-heading"><h3>实时内容流</h3><span>来自 /api/content</span></div>
              <div className="content-list">{result.items.slice(0, 6).map((item) => <article key={item.id}><span>{item.category}</span><div><h4>{item.title}</h4><p>{item.summary}</p></div><small>{item.readingTime} 分钟</small></article>)}</div>
            </div>
          </>
        )}
      </section>
      <div className="lab-note">提示：图片与接口请求均带有唯一标识，以避免浏览器缓存影响重复测试。测试载荷使用随机数据，模拟真实下载。</div>
    </div>
  );
}
