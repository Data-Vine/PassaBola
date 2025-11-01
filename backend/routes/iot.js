/**
 * Rotas para dados IoT
 * @module routes/iot
 */
const express = require("express");
const router = express.Router();
const { getLeiturasIot } = require("../services/iotService");

/**
 * GET /api/iot/status
 * Retorna os dados atuais do dispositivo IoT
 */
router.get("/status", async (req, res) => {
  try {
    const dados = await getLeiturasIot();
    res.json(dados);
  } catch (err) {
    res.status(500).json({ 
      erro: "Não foi possível obter dados do dispositivo IoT" 
    });
  }
});

module.exports = router;
