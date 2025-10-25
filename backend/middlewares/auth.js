/**
 * Middleware de autenticação JWT
 * @module auth
 */
const jwt = require("jsonwebtoken");

const SECRET = "passabola-dev-secret";

/**
 * Middleware para proteger rotas - verifica Bearer token
 * @param {Object} req - Request
 * @param {Object} res - Response
 * @param {Function} next - Next
 */
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ erro: "Não autorizado" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ erro: "Não autorizado" });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({ erro: "Não autorizado" });
  }
}

/**
 * Helper para emitir token JWT
 * @param {Object} payload - { id, email, role }
 * @returns {string} Token JWT
 */
function sign(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "2h" });
}

module.exports = { auth, sign };
