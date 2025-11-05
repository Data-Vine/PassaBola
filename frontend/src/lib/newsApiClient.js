import { apiFetch } from './api.js';

export async function listNews(params = {}) {
  const qs = new URLSearchParams({ page: 1, pageSize: 12, language: 'pt', ...params });
  const r = await apiFetch(`/api/news?${qs.toString()}`);
  if (!r.ok) return { total: 0, items: [] };
  return r.json();
}