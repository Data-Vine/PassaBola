const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(cors({ origin: ['http://localhost:5173'] }));

// Store em memória
const store = {
  teams: [],
  matches: [],
  gallery: [{ id: 1, url: 'https://picsum.photos/800/500', caption: 'Foto 1' }],
  live: { games: [] },
};
let nextTeamId = 1;

// Router /api
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (email === 'admin@local' && password === 'admin') {
      return res.json({ token: 'demo-1' });
    }
    
    return res.status(401).json({ error: 'credenciais inválidas' });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'erro interno' });
  }
});

app.get('/api/status', async (req, res) => {
  try {
    res.json({ ok: true, time: new Date().toISOString() });
  } catch (err) {
    console.error('Erro no status:', err);
    res.status(500).json({ error: 'erro interno' });
  }
});

app.get('/api/teams', async (req, res) => {
  try {
    res.json(store.teams);
  } catch (err) {
    console.error('Erro ao buscar times:', err);
    res.status(500).json({ error: 'erro interno' });
  }
});

app.post('/api/teams', async (req, res) => {
  try {
    const { name, city } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Nome do time é obrigatório' });
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
    console.error('Erro ao criar time:', err);
    res.status(500).json({ error: 'erro interno' });
  }
});

app.get('/api/tournament', async (req, res) => {
  try {
    res.json({ matches: store.matches });
  } catch (err) {
    console.error('Erro ao buscar tabela:', err);
    res.status(500).json({ error: 'erro interno' });
  }
});

app.get('/api/gallery', async (req, res) => {
  try {
    res.json(store.gallery);
  } catch (err) {
    console.error('Erro ao buscar galeria:', err);
    res.status(500).json({ error: 'erro interno' });
  }
});

app.get('/api/live', async (req, res) => {
  try {
    res.json(store.live);
  } catch (err) {
    console.error('Erro ao buscar jogos ao vivo:', err);
    res.status(500).json({ error: 'erro interno' });
  }
});

// 404 e erro genérico
app.use((req, res) => {
  res.status(404).json({ error: 'rota não encontrada' });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'erro interno' });
});

app.listen(PORT, () => {
  console.log(`API em http://localhost:${PORT}`);
});