export async function listNews(params = {}) {
  const qs = new URLSearchParams({ page: 1, pageSize: 12, language: 'pt', ...params });
  const r = await fetch(`/api/news?${qs.toString()}`);
  if (!r.ok) return { total: 0, items: [] };
  return r.json();
}