// Helpers de autenticação para o frontend

// 1) Base da API normalizada (sem barra no final)
const API_BASE_RAW = import.meta.env.VITE_API_URL || "";
const API_BASE = API_BASE_RAW.replace(/\/$/, "");

// Debug útil pra produção: ver se a env entrou no build
if (!API_BASE) {
  console.warn(
    "[api] VITE_API_URL está vazia no build! As chamadas ficarão relativas e vão quebrar em produção."
  );
}

// Exportar para uso em outros arquivos
export const API = API_BASE;

// Obter token do localStorage
export function getToken() {
  return localStorage.getItem("passabola:token") || "";
}

// Fetch com autorização automática + validações úteis
export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();

  if (token) headers.Authorization = `Bearer ${token}`;

  // 2) Garanta que path tenha "/" e monte URL ABSOLUTA
  const p = path.startsWith("/") ? path : `/${path}`;
  const url = path.startsWith("http") ? path : `${API_BASE}${p}`;

  // Se a base estiver vazia em prod, deixe o erro explícito
  if (!path.startsWith("http") && !API_BASE) {
    throw new Error(
      `[api] VITE_API_URL ausente. Não posso chamar '${p}' como relativo em produção.`
    );
  }

  const res = await fetch(url, { ...options, headers });

  // Se não autorizado, limpar localStorage
  if (res.status === 401) {
    localStorage.removeItem("passabola:token");
    localStorage.removeItem("passabola:user");
  }

  return res;
}

// ===== Helpers de auth =====
export async function login(email, senha) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  let data;
  try { data = await res.json(); }
  catch {
    const text = await res.text();
    throw new Error(`Login: resposta não-JSON: ${text.slice(0, 200)}`);
  }

  if (!res.ok) throw new Error(data?.erro || "Falha no login");

  localStorage.setItem("passabola:token", data.token);
  localStorage.setItem("passabola:user", JSON.stringify(data.user));

  return data.user;
}

export async function registerUser({ nome, email, senha }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  let data;
  try { data = await res.json(); }
  catch {
    const text = await res.text();
    throw new Error(`Cadastro: resposta não-JSON: ${text.slice(0, 200)}`);
  }

  if (!res.ok) throw new Error(data?.erro || "Falha no cadastro");

  localStorage.setItem("passabola:token", data.token);
  localStorage.setItem("passabola:user", JSON.stringify(data.user));

  return data.user;
}

export function logout() {
  localStorage.removeItem("passabola:token");
  localStorage.removeItem("passabola:user");
}

export function getCurrentUser() {
  const userJson = localStorage.getItem("passabola:user");
  if (!userJson) return null;
  try { return JSON.parse(userJson); } catch { return null; }
}

export function isAuthenticated() {
  return !!getToken();
}

// ===== Helpers de Inscrições =====
export async function listarMinhasInscricoes() {
  const r = await apiFetch("/api/minhas-inscricoes");
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || "Falha ao listar");
  }
  return r.json();
}

export async function obterMinhaInscricao(id) {
  const r = await apiFetch(`/api/minhas-inscricoes/${id}`);
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || "Falha ao carregar");
  }
  return r.json();
}

export async function criarMinhaInscricao(payload) {
  const r = await apiFetch("/api/minhas-inscricoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || "Falha ao criar");
  }
  return r.json();
}

export async function editarMinhaInscricao(id, payload) {
  const r = await apiFetch(`/api/minhas-inscricoes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || "Falha ao editar");
  }
  return r.json();
}

export async function excluirMinhaInscricao(id) {
  const r = await apiFetch(`/api/minhas-inscricoes/${id}`, { method: "DELETE" });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || "Falha ao excluir");
  }
}
