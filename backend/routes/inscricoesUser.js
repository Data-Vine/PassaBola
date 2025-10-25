// Rotas de inscrições para usuário comum
const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const {
  listarPorUserId,
  buscarPorId,
  criarInscricao,
  atualizarInscricao,
  excluirInscricao,
} = require("../lib/storage/inscricoesStore");

// Todas as rotas exigem autenticação
router.use(auth);

// GET /api/minhas-inscricoes - Lista inscrições do usuário
router.get("/", async (req, res) => {
  try {
    const inscricoes = await listarPorUserId(req.user.id);
    res.json(inscricoes);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

// GET /api/minhas-inscricoes/:id - Obter inscrição específica
router.get("/:id", async (req, res) => {
  try {
    const inscricao = await buscarPorId(req.params.id);
    
    if (!inscricao) {
      return res.status(404).json({ erro: "Inscrição não encontrada" });
    }

    if (inscricao.userId !== req.user.id) {
      return res.status(403).json({ erro: "Proibido" });
    }

    res.json(inscricao);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

// POST /api/minhas-inscricoes - Criar nova inscrição
router.post("/", async (req, res) => {
  try {
    const { time, responsavel, atletas } = req.body;

    if (!time || !time.nome || !responsavel || !responsavel.nome) {
      return res.status(400).json({ erro: "Dados inválidos" });
    }

    if (!Array.isArray(atletas) || atletas.length === 0) {
      return res.status(400).json({ erro: "Deve haver pelo menos uma atleta" });
    }

    const nova = await criarInscricao({
      userId: req.user.id,
      time,
      responsavel,
      atletas,
    });

    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

// PATCH /api/minhas-inscricoes/:id - Editar inscrição (somente se pendente)
router.patch("/:id", async (req, res) => {
  try {
    const inscricao = await buscarPorId(req.params.id);

    if (!inscricao) {
      return res.status(404).json({ erro: "Inscrição não encontrada" });
    }

    if (inscricao.userId !== req.user.id) {
      return res.status(403).json({ erro: "Proibido" });
    }

    if (inscricao.status !== "pendente") {
      return res.status(400).json({ erro: "Só é possível editar inscrições pendentes" });
    }

    const { userId, status, criadoEm, id, ...dadosEditaveis } = req.body;

    const atualizada = await atualizarInscricao(req.params.id, dadosEditaveis);
    res.json(atualizada);
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

// DELETE /api/minhas-inscricoes/:id - Excluir inscrição (somente se pendente)
router.delete("/:id", async (req, res) => {
  try {
    const inscricao = await buscarPorId(req.params.id);

    if (!inscricao) {
      return res.status(404).json({ erro: "Inscrição não encontrada" });
    }

    if (inscricao.userId !== req.user.id) {
      return res.status(403).json({ erro: "Proibido" });
    }

    if (inscricao.status !== "pendente") {
      return res.status(400).json({ erro: "Só é possível excluir inscrições pendentes" });
    }

    await excluirInscricao(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

module.exports = router;
