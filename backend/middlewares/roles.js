/**
 * Middleware para verificar role do usuário
 * @param {string} role - Role requerida (admin, capita)
 * @returns {Function} Middleware
 */
function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ erro: "Proibido" });
    }
    next();
  };
}

module.exports = { requireRole };
