// Helpers de autenticação para o frontend
// Usar caminho relativo para aproveitar o proxy do Vite
const API_BASE = "";

// Obter token do localStorage
export function getToken() {
  return localStorage.getItem("passabola:token") || "";
}

// Fetch com autorização automática
export async function apiFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, { ...options, headers });

  // Se não autorizado, limpar localStorage
  if (res.status === 401) {
    localStorage.removeItem("passabola:token");
    localStorage.removeItem("passabola:user");
  }

  return res;
}

// Login
export async function login(email, senha) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.erro || "Falha no login");
  }

  localStorage.setItem("passabola:token", data.token);
  localStorage.setItem("passabola:user", JSON.stringify(data.user));

  return data.user;
}

// Registro (auto-login após cadastro)
export async function registerUser({ nome, email, senha }) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.erro || "Falha no cadastro");
  }

  // Rota já devolve token + user -> persistir e seguir logado
  localStorage.setItem("passabola:token", data.token);
  localStorage.setItem("passabola:user", JSON.stringify(data.user));

  return data.user;
}

// Logout
export function logout() {
  localStorage.removeItem("passabola:token");
  localStorage.removeItem("passabola:user");
}

// Obter usuário atual
export function getCurrentUser() {
  const userJson = localStorage.getItem("passabola:user");
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

// Verificar se está autenticado
export function isAuthenticated() {
  return !!getToken();
}

// === Helpers de Inscrições do Usuário ===

export async function listarMinhasInscricoes() {
  const r = await apiFetch("/api/minhas-inscricoes");
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    throw new Error(data?.erro || "Falha ao listar");
  }
  return await r.json();
}

export async function obterMinhaInscricao(id) {
  const r = await apiFetch(`/api/minhas-inscricoes/${id}`);
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    throw new Error(data?.erro || "Falha ao carregar");
  }
  return await r.json();
}

export async function criarMinhaInscricao(payload) {
  const r = await apiFetch("/api/minhas-inscricoes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    throw new Error(data?.erro || "Falha ao criar");
  }
  return await r.json();
}

export async function editarMinhaInscricao(id, payload) {
  const r = await apiFetch(`/api/minhas-inscricoes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const data = await r.json().catch(() => ({}));
    throw new Error(data?.erro || "Falha ao editar");
  }
  return await r.json();
}

export async function excluirMinhaInscricao(id) {
  const r = await apiFetch(`/api/minhas-inscricoes/${id}`, { method: "DELETE" });
  if (!r.ok) {
    const data = await r.json().catch(() => null);
    throw new Error(data?.erro || "Falha ao excluir");
  }
}
