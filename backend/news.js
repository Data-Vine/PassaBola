const express = require('express');
const NewsAPI = require('newsapi');
const router = express.Router();

// Chave da NewsAPI (modo teste local)
const newsapi = new NewsAPI('deb4b58c576d4d2baf77dbfb33322511');

const cache = new Map();
const TTL = 15 * 60 * 1000; // cache por 15 min

// Termos focados em futebol feminino (pode ajustar)
const BASE_Q =
  '("liga feminina" OR "seleção feminina" OR "copa feminina" OR "libertadores feminina" OR "campeonato brasileiro feminino")';

// Domínios preferidos (ordem importa: o 1º tem mais prioridade)
const DEFAULT_INCLUDE = '';
// Domínios para excluir (também vale para subdomínios)
const DEFAULT_EXCLUDE = 'ig.com.br,sapo.pt';

/* ------------------------ Helpers ------------------------ */

// Extrai o host (sem "www.")
const hostOf = (u) => {
  try { return new URL(u).hostname.replace(/^www\./,'').toLowerCase(); }
  catch { return ''; }
};

// Normaliza texto: minúsculas, sem acentos, sem pontuação, com espaços simples
const normalize = (s='') => String(s)
  .toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .replace(/\s+[-–—|]\s+.*$/,'')     // remove sufixo " - UOL" / " | Metrópoles"
  .replace(/[^a-z0-9\s]/g,' ')
  .replace(/\s+/g,' ')
  .trim();

// Quebra em tokens simples (palavras úteis)
const tokens = (s='') => normalize(s).split(' ')
  .filter(w => w && w.length >= 3 && !/^\d+$/.test(w));

// Gera bigramas (pares de palavras) para comparar títulos "parecidos"
const bigrams = (arr=[]) => {
  const res = new Set();
  for (let i=0;i<arr.length-1;i++) res.add(arr[i]+' '+arr[i+1]);
  return res;
};

// Similaridade de Jaccard entre conjuntos
const jaccard = (A,B) => {
  if (!A.size || !B.size) return 0;
  let inter=0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
};

// Verifica se as datas estão próximas (ex.: ≤ 4 dias)
const withinDays = (aIso,bIso,days=4) => {
  const a = new Date(aIso).getTime();
  const b = new Date(bIso).getTime();
  if (!isFinite(a) || !isFinite(b)) return true;
  return Math.abs(a-b) <= days*24*60*60*1000;
};

// Gera uma "chave canônica" da URL (host + path, sem parâmetros de tracking)
const canonicalKeyFromUrl = (urlStr) => {
  try {
    const u = new URL(urlStr);
    const host = u.hostname.replace(/^www\./,'');
    // remove parâmetros de rastreio (utm_*, gclid, fbclid, etc.)
    for (const [k] of [...u.searchParams.entries()]) {
      if (/^(utm_|gclid|fbclid|icid|cmp|cmpid|source|ref)/i.test(k)) u.searchParams.delete(k);
    }
    return `${host}${u.pathname}`.toLowerCase();
  } catch { return urlStr || ''; }
};

// Exclui domínio por sufixo (uol.com.br também exclui esporte.uol.com.br)
const makeExcluder = (csv) => {
  const list = (csv||'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);
  return (host) => list.some(dom => host === dom || host.endsWith('.'+dom));
};

// Cria ranking de preferência pelo CSV de "include" (menor índice = melhor)
const makeRank = (includeCsv) => {
  const rank = {};
  includeCsv.split(',').map(s=>s.trim()).filter(Boolean)
    .forEach((d,i)=> rank[d.replace(/^www\./,'').toLowerCase()] = i);
  return rank;
};

// Escolhe a "melhor" versão entre dois artigos
// Prioriza: domínio melhor rankeado > tem imagem > tem descrição > mais recente
const pickBetter = (a,b,rank) => {
  const domScore = (x) => 100 - ((rank[hostOf(x.url)] ?? 99));
  const timeScore = (x) => {
    const t = new Date(x.publishedAt).getTime();
    return isFinite(t) ? (t/1e11) : 0; // pontinho para preferir mais novo
  };
  const score = (x) => domScore(x) + (x.urlToImage?3:0) + (x.description?1:0) + timeScore(x);
  return score(a) >= score(b) ? a : b;
};

// Regras SIMPLES para dizer se dois artigos são "o mesmo assunto"
const areDuplicates = (a,b,{simTitle=0.56, simBigram=0.48}={}) => {
  // 1) URL canônica igual
  if (canonicalKeyFromUrl(a.url) === canonicalKeyFromUrl(b.url)) return true;

  // 2) Título igual/contido
  const ta = normalize(a.title||'');
  const tb = normalize(b.title||'');
  if (!ta || !tb) return false;
  if (ta === tb) return true;
  if (ta.length>18 && tb.length>18 && (ta.includes(tb) || tb.includes(ta))) return true;

  // 3) Tokens (título+descrição) + janela de tempo
  const tokA = tokens((a.title||'')+' '+(a.description||'')),
        tokB = tokens((b.title||'')+' '+(b.description||''));
  const ja = jaccard(new Set(tokA), new Set(tokB));
  if (ja >= simTitle && withinDays(a.publishedAt,b.publishedAt,4)) return true;

  // 4) Bigramas (ajuda quando trocam ordem das palavras)
  const biA = bigrams(tokA), biB = bigrams(tokB);
  const jb = jaccard(biA, biB);
  if (jb >= simBigram && withinDays(a.publishedAt,b.publishedAt,4)) return true;

  return false;
};

/* ------------------------ Rota /api/news ------------------------ */
router.get('/news', async (req,res) => {
  try {
    const {
      q='',
      language='pt',
      from, to,
      page=1,
      pageSize=12,
      domains,            // whitelist opcional (?domains=ge.globo.com,terra.com.br)
      excludeDomains,     // blacklist opcional (?excludeDomains=ig.com.br,sapo.pt)
      sim                 // agressividade opcional (ex.: 0.6 = mais rígido; 0.52 = mais agressivo)
    } = req.query;

    // listas de include/exclude (com padrões)
    const includeCsv = (domains && String(domains).trim()) ? domains : DEFAULT_INCLUDE;
    const excludeCsv = (excludeDomains && String(excludeDomains).trim()) ? excludeDomains : DEFAULT_EXCLUDE;

    // helpers baseados nas listas
    const excluder = makeExcluder(excludeCsv);
    const rank = makeRank(includeCsv);

    // query final para a NewsAPI
    const query = [BASE_Q, q].filter(Boolean).join(' AND ');

    // cache por combinação dos parâmetros
    const key = JSON.stringify({query, language, from, to, page, pageSize, includeCsv, excludeCsv, sim});
    const c = cache.get(key);
    if (c && Date.now()-c.t < TTL) return res.json(c.data);

    // pedimos mais itens para poder deduplicar/sobrar
    const requested = Number(pageSize);
    const fetchSize = Math.min(Math.max(requested*3, 45), 100);

    // chamada à NewsAPI (usa whitelist de domínios)
    const r = await newsapi.v2.everything({
      q: query,
      language,
      from, to,
      sortBy: 'publishedAt',
      page: Number(page),
      pageSize: fetchSize,
      domains: includeCsv // NewsAPI só aceita "include" de domínios
    });

    // 1) exclui domínios indesejados (por sufixo do host)
    const raw = (r.articles||[]).filter(a => !excluder(hostOf(a.url)));

    // 2) dedupe (simples e agressivo o suficiente)
    const thresholds = {
      simTitle: Math.max(0.5, Math.min(0.7, Number(sim) || 0.56)), // título+descrição
      simBigram: 0.48                                              // pares de palavras
    };

    const uniques = [];
    for (const a of raw) {
      let merged = false;
      for (let i=0;i<uniques.length;i++) {
        const b = uniques[i];
        if (areDuplicates(a,b,thresholds)) {
          // se é duplicado, guarda a melhor versão (preferência de domínio, imagem etc.)
          uniques[i] = pickBetter(a,b,rank);
          merged = true;
          break;
        }
      }
      if (!merged) uniques.push(a);
    }

    // 3) mapeia para o formato do front e limita ao pageSize
    const mapped = uniques.map(a => ({
      id: Buffer.from(a.url).toString('base64').slice(0,16),
      title: a.title,
      excerpt: a.description,
      cover: a.urlToImage || null,
      url: a.url,
      source: a.source?.name,
      publishedAt: a.publishedAt
    }));

    const data = {
      total: mapped.length,                       // total após dedupe (antes do slice)
      domains: includeCsv,                        // domínios incluídos
      excluded: excludeCsv.split(',').map(s=>s.trim()).filter(Boolean), // domínios excluídos
      items: mapped.slice(0, requested)           // itens enviados ao front
    };

    cache.set(key, {t: Date.now(), data});
    res.json(data);
  } catch (e) {
    console.error('Erro na API de notícias:', e);
    res.status(502).json({ total: 0, items: [], error: 'NEWSAPI_UNAVAILABLE' });
  }
});

module.exports = router;
