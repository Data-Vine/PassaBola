/**
 * Persistência de inscrições em JSON com escrita atômica
 * @module inscricoesStore
 */
const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(process.cwd(), "data");
const INSCRICOES_FILE = path.join(DATA_DIR, "inscricoes.json");
const INSCRICOES_TMP = path.join(DATA_DIR, "inscricoes.tmp");

/**
 * Garante que o diretório e arquivo existem
 */
async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(INSCRICOES_FILE);
  } catch {
    await fs.writeFile(INSCRICOES_FILE, "[]", "utf-8");
  }
}

/**
 * Retorna lista de inscrições
 * @returns {Promise<Array>} Array de inscrições
 */
async function listarInscricoes() {
  await ensureFile();
  const raw = await fs.readFile(INSCRICOES_FILE, "utf-8");
  return JSON.parse(raw || "[]");
}

/**
 * Escrita atômica: grava em .tmp e depois rename
 * @param {Array} lista - Lista de inscrições
 */
async function salvarInscricoes(lista) {
  await ensureFile();
  await fs.writeFile(INSCRICOES_TMP, JSON.stringify(lista, null, 2), "utf-8");
  await fs.rename(INSCRICOES_TMP, INSCRICOES_FILE);
}

/**
 * Busca inscrição por ID
 * @param {string} id - ID da inscrição
 * @returns {Promise<Object|null>} Inscrição ou null
 */
async function buscarPorId(id) {
  const all = await listarInscricoes();
  return all.find((i) => i.id === id) || null;
}

/**
 * Cria nova inscrição
 * @param {Object} dados - { userId, time, responsavel, atletas }
 * @returns {Promise<Object>} Inscrição criada
 */
async function criarInscricao(dados) {
  const all = await listarInscricoes();
  const agora = new Date().toISOString();
  const nova = {
    id: `insc_${Date.now()}`,
    ...dados,
    status: "pendente",
    criadoEm: agora,
    atualizadoEm: agora,
  };
  all.push(nova);
  await salvarInscricoes(all);
  return nova;
}

/**
 * Atualiza inscrição existente
 * @param {string} id - ID da inscrição
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object|null>} Inscrição atualizada ou null
 */
async function atualizarInscricao(id, dados) {
  const all = await listarInscricoes();
  const index = all.findIndex((i) => i.id === id);
  if (index === -1) return null;

  const atualizada = {
    ...all[index],
    ...dados,
    atualizadoEm: new Date().toISOString(),
  };
  all[index] = atualizada;
  await salvarInscricoes(all);
  return atualizada;
}

/**
 * Exclui inscrição
 * @param {string} id - ID da inscrição
 * @returns {Promise<boolean>} true se excluiu, false se não encontrou
 */
async function excluirInscricao(id) {
  const all = await listarInscricoes();
  const filtrado = all.filter((i) => i.id !== id);
  if (filtrado.length === all.length) return false;
  await salvarInscricoes(filtrado);
  return true;
}

/**
 * Lista inscrições por userId
 * @param {number} userId - ID do usuário
 * @returns {Promise<Array>} Array de inscrições do usuário
 */
async function listarPorUserId(userId) {
  const all = await listarInscricoes();
  return all.filter((i) => i.userId === userId);
}

module.exports = {
  listarInscricoes,
  salvarInscricoes,
  buscarPorId,
  criarInscricao,
  atualizarInscricao,
  excluirInscricao,
  listarPorUserId,
};
