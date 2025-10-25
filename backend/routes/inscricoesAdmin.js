// Rotas admin para gerenciar inscrições
const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { requireRole } = require("../middlewares/roles");
const {
  listarInscricoes,
  buscarPorId,
  atualizarInscricao,
  excluirInscricao,
} = require("../lib/storage/inscricoesStore");

// Todas as rotas exigem auth + role admin
router.use(auth, requireRole("admin"));

// GET /api/admin/inscricoes - Lista todas as inscrições
router.get("/", async (req, res) => {
  try {
    const inscricoes = await listarInscricoes();
    res.json(inscricoes);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

// GET /api/admin/inscricoes/:id - Obter inscrição específica
router.get("/:id", async (req, res) => {
  try {
    const inscricao = await buscarPorId(req.params.id);
    
    if (!inscricao) {
      return res.status(404).json({ erro: "Inscrição não encontrada" });
    }

    res.json(inscricao);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

// PATCH /api/admin/inscricoes/:id/status - Atualizar status da inscrição
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pendente", "aprovado", "reprovado"].includes(status)) {
      return res.status(400).json({ erro: "Status inválido" });
    }

    const inscricao = await buscarPorId(req.params.id);
    if (!inscricao) {
      return res.status(404).json({ erro: "Inscrição não encontrada" });
    }

    const atualizada = await atualizarInscricao(req.params.id, { status });
    res.json(atualizada);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

// DELETE /api/admin/inscricoes/:id - Excluir qualquer inscrição
router.delete("/:id", async (req, res) => {
  try {
    const inscricao = await buscarPorId(req.params.id);
    
    if (!inscricao) {
      return res.status(404).json({ erro: "Inscrição não encontrada" });
    }

    await excluirInscricao(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

module.exports = router;
