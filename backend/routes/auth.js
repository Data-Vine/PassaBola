// Rotas de autenticação
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const { buscarPorEmail, criarUsuario } = require("../lib/storage/usuariosStore");
const { auth, sign } = require("../middlewares/auth");

// Helper para validar email
function isEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// POST /api/auth/register - Registrar novo usuário
router.post("/register", async (req, res) => {
  try {
    const { nome = "", email, senha, role } = req.body || {};
    const e = (email || "").toLowerCase().trim();
    const p = (senha || "").trim();

    // Validação
    const detalhes = {};
    if (!isEmail(e)) {
      detalhes.email = "formato inválido";
    }
    if (p.length < 6) {
      detalhes.senha = "mínimo 6 caracteres";
    }

    if (Object.keys(detalhes).length > 0) {
      return res.status(400).json({ erro: "Dados inválidos", detalhes });
    }

    // Verificar se email já existe
    const existente = await buscarPorEmail(e);
    if (existente) {
      return res.status(409).json({ erro: "Email já cadastrado" });
    }

    // Hash da senha
    const hash = await bcrypt.hash(p, 10);

    // Criar usuário
    const novo = await criarUsuario({
      nome,
      email: e,
      senhaHash: hash,
      role: role || "capita",
    });

    // Gerar token para auto-login
    const token = sign({
      id: novo.id,
      email: novo.email,
      role: novo.role,
    });

    // Retornar token + user (auto-login)
    return res.status(201).json({
      token,
      user: {
        id: novo.id,
        email: novo.email,
        role: novo.role,
        nome: novo.nome,
      },
    });
  } catch (err) {
    return res.status(500).json({ erro: "Erro interno" });
  }
});

// POST /api/auth/login - Login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Dados inválidos", detalhes: { email: "Email e senha são obrigatórios" } });
    }

    const emailLower = email.toLowerCase().trim();

    // Buscar usuário
    const usuario = await buscarPorEmail(emailLower);
    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    // Gerar token
    const token = sign({
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
    });

    // Retornar token e dados do usuário (sem senha)
    res.json({
      token,
      user: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
        nome: usuario.nome,
      },
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

// GET /api/auth/me - Obter dados do usuário autenticado
router.get("/me", auth, async (req, res) => {
  try {
    const usuario = await buscarPorEmail(req.user.email);
    
    if (!usuario) {
      return res.status(401).json({ erro: "Não autorizado" });
    }

    res.json({
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
      nome: usuario.nome,
    });
  } catch (err) {
    res.status(500).json({ erro: "Erro interno" });
  }
});

module.exports = router;
