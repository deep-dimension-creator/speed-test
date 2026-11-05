"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity, ArrowDown, ArrowRight, Check, ChevronDown, ChevronUp, Clock3,
  Compass, Database, Gauge, ImageIcon, LoaderCircle, RotateCcw, Signal, X,
} from "lucide-react";
import type { Article } from "@/lib/articles";
import { formatBytes } from "@/lib/history";
import { getPageMetrics, observeWebVitals } from "@/lib/performance";
import type { PageMetrics } from "@/lib/types";

const PAGE_SIZE = 12;

interface ArticleResponse {
  items: Article[];
  requestId: string;
  responseMs: number;
  hasMore: boolean;
  total: number;
  page: number;
}

async function requestArticles(pageNumber: number, existingRequestId?: string): Promise<ArticleResponse> {
  const requestId = existingRequestId ?? `page-${Date.now()}`;
  const startedAt = performance.now();
  const response = await fetch(`/api/articles?page=${pageNumber}&pageSize=${PAGE_SIZE}&run=${requestId}-${pageNumber}`, { cache: "no-store" });
  if (!response.ok) throw new Error("内容暂时未能加载，请重试");
  const data = await response.json() as { items: Article[]; hasMore: boolean; total: number; page: number };
  return { ...data, requestId, responseMs: performance.now() - startedAt };
}

function ArticleImage({ article, requestId, loaded, onLoad, priority = false }: {
  article: Article;
  requestId: string;
  loaded: boolean;
  onLoad: () => void;
  priority?: boolean;
}) {
  return (
    <>
      {!loaded && <div className="editorial-image-skeleton"><ImageIcon size={24} /><span>图片加载中</span></div>}
      <Image
        src={`/gallery-${article.image}.jpg?run=${requestId}&article=${article.id}`}
        alt={article.title}
        fill
        sizes={priority ? "(max-width: 760px) 100vw, 62vw" : "(max-width: 760px) 100vw, 33vw"}
        unoptimized
        priority={priority}
        loading="eager"
        className={`editorial-photo ${loaded ? "is-loaded" : ""}`}
        onLoad={onLoad}
      />
    </>
  );
}

function ArticleSkeletons({ count }: { count: number }) {
  return Array.from({ length: count }, (_, index) => (
    <article className="article-card" key={`skeleton-${index}`}><div className="article-image skeleton-block" /><span className="skeleton-line short" /><span className="skeleton-line title" /><span className="skeleton-line" /><span className="skeleton-line" /></article>
  ));
}

function HeavyGallery({ requestId, loadedImages, onLoad }: {
  requestId: string;
  loadedImages: Set<number>;
  onLoad: (id: number) => void;
}) {
  return (
    <section className="heavy-gallery-section" aria-label="高清影像重载场景">
      <div className="section-heading"><div><span className="article-kicker">HIGH-RESOLUTION GALLERY</span><h2>光影集</h2></div><p><span className="heavy-tag">重载场景</span>12 张高清原图 · 约 3.8 MB</p></div>
      <div className="heavy-gallery-grid">
        {Array.from({ length: 12 }, (_, index) => {
          const id = 1000 + index;
          const loaded = loadedImages.has(id);
          return (
            <figure className={`heavy-gallery-item gallery-shape-${(index % 4) + 1}`} key={id}>
              {!loaded && <div className="editorial-image-skeleton"><ImageIcon size={24} /><span>高清图片 {index + 1} 加载中</span></div>}
              <Image
                src={`/gallery-${index + 1}.jpg?run=${requestId}&gallery=${index + 1}`}
                alt={`旅行高清影像 ${index + 1}`}
                fill
                sizes="(max-width: 600px) 100vw, 33vw"
                unoptimized
                loading="eager"
                className={`editorial-photo ${loaded ? "is-loaded" : ""}`}
                onLoad={() => onLoad(id)}
              />
              <figcaption><span>FRAME {String(index + 1).padStart(2, "0")}</span><span>1200 × 800</span></figcaption>
            </figure>
          );
        })}
      </div>
    </section>
  );
}

export function ExperiencePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [requestId, setRequestId] = useState("");
  const [responseMs, setResponseMs] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalArticles, setTotalArticles] = useState(48);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [monitorOpen, setMonitorOpen] = useState(true);
  const [page, setPage] = useState<PageMetrics>({ ttfb: null, fcp: null, lcp: null, cls: null, loadedBytes: 0 });

  useEffect(() => {
    observeWebVitals();
    let active = true;
    requestArticles(1).then((data) => {
      if (!active) return;
      setArticles(data.items);
      setRequestId(data.requestId);
      setResponseMs(data.responseMs);
      setCurrentPage(data.page);
      setTotalArticles(data.total);
      setHasMore(data.hasMore);
      setPage(getPageMetrics());
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "页面加载失败");
    }).finally(() => {
      if (active) setLoading(false);
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hasMore || loading || loadingMore || !articles.length || !requestId) return;
    const target = document.getElementById("article-load-sentinel");
    if (!target) return;
    let requested = false;
    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting || requested) return;
      requested = true;
      setLoadingMore(true);
      setError("");
      requestArticles(currentPage + 1, requestId).then((data) => {
        setArticles((current) => [...current, ...data.items]);
        setCurrentPage(data.page);
        setTotalArticles(data.total);
        setHasMore(data.hasMore);
        setResponseMs(data.responseMs);
        setPage(getPageMetrics());
      }).catch((reason: unknown) => {
        setError(reason instanceof Error ? reason.message : "下一批内容加载失败");
      }).finally(() => {
        setLoadingMore(false);
      });
    }, { rootMargin: "280px 0px", threshold: 0.01 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [articles.length, currentPage, hasMore, loading, loadingMore, requestId]);

  function markImageLoaded(id: number) {
    setLoadedImages((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
    setPage(getPageMetrics());
  }

  async function reloadExperience() {
    if (loading || loadingMore) return;
    setLoading(true);
    setError("");
    setArticles([]);
    setLoadedImages(new Set());
    setRequestId("");
    setResponseMs(null);
    setCurrentPage(0);
    setHasMore(true);
    try {
      const data = await requestArticles(1);
      setArticles(data.items);
      setRequestId(data.requestId);
      setResponseMs(data.responseMs);
      setCurrentPage(data.page);
      setTotalArticles(data.total);
      setHasMore(data.hasMore);
      setPage(getPageMetrics());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "页面加载失败");
    } finally {
      setLoading(false);
    }
  }

  const featured = articles[0];
  const loadedCount = loadedImages.size;
  const expectedImages = articles.length ? articles.length + 12 : 0;
  const progress = expectedImages ? Math.round((loadedCount / expectedImages) * 100) : 0;
  const currentBatchComplete = expectedImages > 0 && loadedCount === expectedImages;
  const allComplete = currentBatchComplete && !hasMore;
  const monitorStatus = loadingMore
    ? "正在加载下一批图文"
    : allComplete
      ? "全部内容加载完成"
      : currentBatchComplete
        ? "本批完成 · 滚动加载更多"
        : "正在实时加载页面";

  return (
    <div className="experience-site">
      <div className="page-load-track"><span style={{ width: `${loading ? 12 : Math.max(progress, 8)}%` }} /></div>
      <header className="editorial-header">
        <div className="editorial-header-inner">
          <Link href="/" className="editorial-brand"><Compass size={27} /><span>远方周刊<small>FARAWAY JOURNAL</small></span></Link>
          <nav className="editorial-nav" aria-label="内容导航"><a href="#featured">本期专题</a><a href="#stories">精选故事</a><a href="#notes">旅行笔记</a></nav>
          <div className="editorial-header-actions">
            <span className="experience-live"><span className="status-dot" />滚动加载实时可见</span>
            <Link href="/dashboard" className="outline-link"><Activity size={15} />体验数据</Link>
          </div>
        </div>
      </header>

      <main className="editorial-container">
        <section className="editorial-intro" id="featured">
          <div className="issue-label"><span>VOL. 026</span><span>冬日旅行特辑</span></div>
          <h1>把世界，装进日常。</h1>
          <p>关于远方、自然与认真生活的四十八个故事。<br />放慢一点，美好的事物值得等待。</p>
          <a href="#stories" className="read-down">开始阅读<ArrowDown size={15} /></a>
        </section>

        {error && <div className="editorial-error"><X size={18} />{error}<button onClick={reloadExperience}>重新加载</button></div>}

        {loading && !featured ? (
          <section className="featured-skeleton"><div className="skeleton-block" /><div><span className="skeleton-line short" /><span className="skeleton-line title" /><span className="skeleton-line title second" /><span className="skeleton-line" /><span className="skeleton-line" /></div></section>
        ) : featured && (
          <section className="featured-story">
            <div className="featured-image">
              <ArticleImage article={featured} requestId={requestId} loaded={loadedImages.has(featured.id)} onLoad={() => markImageLoaded(featured.id)} priority />
              <span className="photo-caption"><ImageIcon size={13} />{featured.location}</span>
            </div>
            <article className="featured-copy">
              <span className="article-kicker">{featured.category}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <p>我们总想在有限的假期里看更多风景，却常常忘记，旅行最珍贵的部分并不是抵达多少个目的地。停下来，看光线缓慢移动，听当地人在街角交谈，陌生的地方才会逐渐有了真实的温度。</p>
              <div className="article-byline"><span className="author-avatar">林</span><div><strong>{featured.author}</strong><span>{featured.location}</span></div><span className="reading-time"><Clock3 size={13} />{featured.readingTime} 分钟阅读</span></div>
            </article>
          </section>
        )}

        {requestId && <HeavyGallery requestId={requestId} loadedImages={loadedImages} onLoad={markImageLoaded} />}

        <div className="editorial-divider"><span>EXPLORE THE STORIES</span></div>

        <section className="stories-section" id="stories">
          <div className="section-heading"><div><span className="article-kicker">EDITORS&apos; PICKS</span><h2>本期精选</h2></div><p>已载入 {articles.length} / {totalArticles} 篇 · 每批 {PAGE_SIZE} 篇</p></div>
          <div className="article-grid">
            {loading && !articles.length ? <ArticleSkeletons count={6} /> : <>
              {articles.slice(1).map((article) => (
                <article className="article-card" key={article.id}>
                  <div className="article-image">
                    <ArticleImage article={article} requestId={requestId} loaded={loadedImages.has(article.id)} onLoad={() => markImageLoaded(article.id)} />
                    <span className="image-location">{article.location}</span>
                  </div>
                  <div className="article-card-body"><span className="article-kicker">{article.category}</span><h3>{article.title}</h3><p>{article.excerpt}</p><div className="card-meta"><span>{article.author}</span><span>{article.readingTime} 分钟阅读</span></div></div>
                </article>
              ))}
              {loadingMore && <ArticleSkeletons count={6} />}
            </>}
          </div>
          <div className="scroll-load-sentinel" id="article-load-sentinel" aria-live="polite">
            {hasMore ? loadingMore ? <><LoaderCircle className="spin" size={19} /><strong>正在加载下一组故事</strong><span>{PAGE_SIZE} 篇文章与高清配图正在路上</span></> : <><ArrowDown size={19} /><strong>继续滚动，自动加载更多</strong><span>每批 {PAGE_SIZE} 篇图文，约 3–4 MB，分批加载</span></> : <><Check size={19} /><strong>已经看到全部 {totalArticles} 篇故事</strong><span>感谢你的耐心阅读</span></>}
          </div>
        </section>

        <section className="journal-notes" id="notes">
          <div className="section-heading"><div><span className="article-kicker">FIELD NOTES</span><h2>旅途手记</h2></div><p>一些值得被记住的片段。</p></div>
          <div className="notes-layout">
            <div className="notes-list">
              {articles.slice(0, 5).map((article, index) => <article key={article.id}><span className="note-number">{String(index + 1).padStart(2, "0")}</span><div><span>{article.category} · {article.location}</span><h3>{article.title}</h3></div><ArrowRight size={18} /></article>)}
              {!articles.length && <div className="notes-loading"><LoaderCircle className="spin" size={20} />正在加载旅行笔记…</div>}
            </div>
            <blockquote>“我们旅行，不是为了逃离生活，<br />而是为了不让生活逃离我们。”<cite>— 远方周刊编辑部</cite></blockquote>
          </div>
        </section>
      </main>

      <footer className="editorial-footer"><div className="editorial-container"><div className="editorial-brand"><Compass size={25} /><span>远方周刊<small>FARAWAY JOURNAL</small></span></div><p>用真实内容，呈现每一次网络加载。</p><Link href="/dashboard">查看本次访问的完整性能数据<ArrowRight size={14} /></Link></div></footer>

      <aside className={`experience-monitor ${monitorOpen ? "open" : "collapsed"}`} aria-label="本次访问体验数据">
        <button className="monitor-heading" onClick={() => setMonitorOpen(!monitorOpen)} aria-expanded={monitorOpen}>
          <span className="monitor-icon"><Signal size={17} /></span><span><strong>本次访问体验</strong><small>{monitorStatus}</small></span>{monitorOpen ? <ChevronDown size={17} /> : <ChevronUp size={17} />}
        </button>
        {monitorOpen && <div className="monitor-body">
          <div className="monitor-primary"><div><span>最近一次请求延迟</span><strong>{responseMs === null ? "—" : responseMs.toFixed(0)}<small> ms</small></strong></div><span className={`monitor-status ${currentBatchComplete ? "complete" : ""}`}>{currentBatchComplete ? <Check size={13} /> : <LoaderCircle className="spin" size={13} />}{allComplete ? "全部完成" : currentBatchComplete ? "本批完成" : "加载中"}</span></div>
          <div className="monitor-metrics"><div><span>首屏呈现</span><strong>{page.fcp === null ? "—" : `${(page.fcp / 1000).toFixed(2)} s`}</strong></div><div><span>首字节 TTFB</span><strong>{page.ttfb === null ? "—" : `${page.ttfb.toFixed(0)} ms`}</strong></div><div><span>累计加载流量</span><strong>{formatBytes(page.loadedBytes)}</strong></div></div>
          <div className="image-progress"><div><span><ImageIcon size={13} />已加载图片</span><strong>{loadedCount} / {expectedImages || PAGE_SIZE + 12}</strong></div><div className="image-progress-track"><span style={{ width: `${progress}%` }} /></div><div className="content-progress-meta"><span>第 {currentPage || 1} 批内容</span><span>文章 {articles.length} / {totalArticles}</span></div></div>
          <div className="monitor-actions"><button onClick={reloadExperience} disabled={loading || loadingMore}><RotateCcw size={13} />重新体验</button><Link href="/dashboard#speed-test"><Gauge size={14} />完整测速<ArrowRight size={12} /></Link></div>
        </div>}
      </aside>
      <div className="monitor-hint"><Database size={13} />滚动页面即可看到延迟与流量持续更新</div>
    </div>
  );
}
