const topics = ["产品动态", "技术观察", "体验研究", "行业资讯", "设计笔记"];

export function GET() {
  const items = Array.from({ length: 36 }, (_, index) => ({
    id: index + 1,
    title: `${topics[index % topics.length]} · 真实内容加载样本 ${String(index + 1).padStart(2, "0")}`,
    summary: "用于模拟内容平台的接口请求、列表渲染与数据加载，帮助观察不同网络负载下的实际浏览体验。",
    category: topics[index % topics.length],
    readingTime: (index % 8) + 2,
  }));

  return Response.json(
    { items, total: items.length, generatedAt: new Date().toISOString() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
