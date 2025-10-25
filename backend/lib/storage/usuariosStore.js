/**
 * Persistência de usuários em JSON com escrita atômica
 * @module usuariosStore
 */
const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(process.cwd(), "data");
const USUARIOS_FILE = path.join(DATA_DIR, "usuarios.json");
const USUARIOS_TMP = path.join(DATA_DIR, "usuarios.tmp");

/**
 * Garante que o diretório e arquivo existem
 */
async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USUARIOS_FILE);
  } catch {
    await fs.writeFile(USUARIOS_FILE, "[]", "utf-8");
  }
}

/**
 * Retorna lista de usuários
 * @returns {Promise<Array>} Array de usuários
 */
async function listarUsuarios() {
  await ensureFile();
  const raw = await fs.readFile(USUARIOS_FILE, "utf-8");
  return JSON.parse(raw || "[]");
}

/**
 * Escrita atômica: grava em .tmp e depois rename
 * @param {Array} lista - Lista de usuários
 */
async function salvarUsuarios(lista) {
  await ensureFile();
  await fs.writeFile(USUARIOS_TMP, JSON.stringify(lista, null, 2), "utf-8");
  await fs.rename(USUARIOS_TMP, USUARIOS_FILE);
}

/**
 * Busca usuário por email (case-insensitive)
 * @param {string} emailLower - Email em lowercase
 * @returns {Promise<Object|null>} Usuário ou null
 */
async function buscarPorEmail(emailLower) {
  const all = await listarUsuarios();
  return all.find((u) => u.email === emailLower) || null;
}

/**
 * Cria novo usuário e salva
 * @param {Object} dados - { nome, email, senhaHash, role }
 * @returns {Promise<Object>} Usuário criado
 */
async function criarUsuario({ nome = "", email, senhaHash, role = "capita" }) {
  const all = await listarUsuarios();
  const user = {
    id: Date.now(),
    nome: nome.trim(),
    email,
    senha: senhaHash,
    role,
  };
  all.push(user);
  await salvarUsuarios(all);
  return user;
}

module.exports = {
  listarUsuarios,
  salvarUsuarios,
  buscarPorEmail,
  criarUsuario,
};
