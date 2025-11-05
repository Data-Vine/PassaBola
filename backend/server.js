const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');

// Carregar .env.local apenas em desenvolvimento
if (process.env.NODE_ENV !== "production") {
  try {
    require("dotenv").config({ path: ".env.local" });
  } catch {}
}

const app = express();
const PORT = process.env.PORT || 5001;

// CORS controlado por variável de ambiente
const allowed = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowed.length === 0 || allowed.includes(origin)) return cb(null, true);
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true
}));

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/healthz", (_req, res) => res.status(200).send("ok"));

// Registrar rotas
app.use('/api', require('./news'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/minhas-inscricoes', require('./routes/inscricoesUser'));
app.use('/api/admin/inscricoes', require('./routes/inscricoesAdmin'));
app.use('/api/iot', require('./routes/iot'));

// Store em memória
const store = {
  teams: [],
  matches: [],
  gallery: [{ id: 1, url: 'https://picsum.photos/800/500', caption: 'Foto 1' }],
  live: { games: [] },
};
let nextTeamId = 1;

// Seed de admin
(async () => {
  const { listarUsuarios, criarUsuario } = require('./lib/storage/usuariosStore');
  const usuarios = await listarUsuarios();
  
  if (usuarios.length === 0) {
    const senhaHash = await bcrypt.hash('admin123', 10);
    await criarUsuario({
      nome: 'Administrador',
      email: 'admin@passabola.com',
      senhaHash,
      role: 'admin',
    });
  }
})();

// Router /api
app.get('/api/status', async (req, res) => {
  try {
    res.json({ ok: true, time: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.get('/api/teams', async (req, res) => {
  try {
    res.json(store.teams);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.post('/api/teams', async (req, res) => {
  try {
    const { name, city } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ erro: 'Nome do time é obrigatório' });
    }
    
    const newTeam = {
      id: nextTeamId++,
      name: name.trim(),
      city: city || null,
      createdAt: Date.now()
    };
    
    store.teams.push(newTeam);
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.get('/api/tournament', async (req, res) => {
  try {
    res.json({ matches: store.matches });
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    res.json(store.gallery);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

app.get('/api/live', async (req, res) => {
  try {
    res.json(store.live);
  } catch (err) {
    res.status(500).json({ erro: 'Erro interno' });
  }
});

// 404 e erro genérico
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

app.use((err, req, res, _next) => {
  res.status(500).json({ erro: 'Erro interno' });
});

app.listen(PORT, () => {
  console.log(`API em http://localhost:${PORT}`);
});