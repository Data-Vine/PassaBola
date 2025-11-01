/**
 * Serviço de leitura de dados IoT
 * @module iotService
 */

// ===== VERSÃO MOCK =====
/**
 * Obtém leituras simuladas do dispositivo IoT
 * 
 * @returns {Object} Dados simulados do dispositivo
 */
function getLeiturasIot() {
  // Gerar valores realistas simulados
  const bpm = Math.floor(Math.random() * (140 - 70 + 1)) + 70; // 70-140
  const spo2 = Math.floor(Math.random() * (100 - 92 + 1)) + 92; // 92-100
  
  // Velocidades em m/s (0-5, com 2 casas decimais)
  const velocidadeX = (Math.random() * 5).toFixed(2);
  const velocidadeY = (Math.random() * 5).toFixed(2);
  const velocidadeZ = (Math.random() * 5).toFixed(2);
  
  return {
    bpm,
    spo2,
    velocidadeX,
    velocidadeY,
    velocidadeZ,
    atualizadoEm: new Date().toISOString()
  };
}
// ===== VERSÃO MOCK =====


// ===== VERSÃO REAL =====
/*
async function getLeiturasIot() {
  try {
    // URL do Orion Context Broker na VM FIWARE
    const FIWARE_URL = "http://20.49.4.108:1026/v2/entities/des001";
    
    const response = await fetch(FIWARE_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });
    
    if (!response.ok) {
      throw new Error(`FIWARE retornou status ${response.status}`);
    }
    
    const entity = await response.json();
    
    // Extrair valores dos atributos da entidade
    const bpm = entity.bpm?.value || 0;
    const spo2 = entity.spo2?.value || 0;
    const velocidadeX = entity.velocidadeX?.value?.toFixed(2) || "0.00";
    const velocidadeY = entity.velocidadeY?.value?.toFixed(2) || "0.00";
    const velocidadeZ = entity.velocidadeZ?.value?.toFixed(2) || "0.00";
    
    return {
      bpm,
      spo2,
      velocidadeX,
      velocidadeY,
      velocidadeZ,
      atualizadoEm: new Date().toISOString()
    };
  } catch (error) {
    console.error("Erro ao buscar dados do FIWARE:", error);
    throw error;
  }
}
*/
// ===== VERSÃO REAL =====


module.exports = { getLeiturasIot };
