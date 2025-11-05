import { useState, useEffect } from "react";
import { Activity, Droplet, TrendingUp, AlertTriangle, Clock } from "lucide-react";
import { apiFetch } from "../lib/api.js";

/**
 * Painel de monitoramento IoT em tempo real
 * Exibe dados do ESP32: BPM, SpO2, velocidades X/Y/Z
 */
export default function PainelIot() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Buscar dados do backend
  const buscarDados = async () => {
    try {
      const response = await apiFetch("/api/iot/status");
      
      if (!response.ok) {
        throw new Error("Erro ao buscar dados IoT");
      }
      
      const data = await response.json();
      setDados(data);
      setErro(null);
      setLoading(false);
    } catch (err) {
      setErro(err.message);
      setLoading(false);
    }
  };

  // Carregar dados inicialmente e atualizar a cada 2 segundos
  useEffect(() => {
    buscarDados();
    
    const intervalo = setInterval(() => {
      buscarDados();
    }, 2000); // 2000ms = 2 segundos
    
    return () => clearInterval(intervalo);
  }, []);

  // Estado de carregamento
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <p className="text-gray-600">Carregando monitoramento...</p>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (erro) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
        <p className="text-red-800">Erro ao carregar monitoramento: {erro}</p>
      </div>
    );
  }

  // Estado normal com dados
  const alertaBPM = dados.bpm > 130;
  const ultimaAtualizacao = dados.atualizadoEm 
    ? new Date(dados.atualizadoEm).toLocaleTimeString('pt-BR')
    : '--:--:--';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cabeçalho do card */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Dados em Tempo Real</h3>
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Clock className="h-3 w-3" />
            <span>{ultimaAtualizacao}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-1">Dispositivo ESP32</p>
      </div>

      {/* Grid de métricas */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BPM - Card com alerta se > 130 */}
          <div 
            className={`rounded-lg border-2 p-4 ${
              alertaBPM 
                ? 'bg-red-50 border-red-300' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className={`h-5 w-5 ${alertaBPM ? 'text-red-600' : 'text-red-500'}`} />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Frequência Cardíaca
                </span>
              </div>
              {alertaBPM && (
                <span className="text-xs font-bold text-red-700 bg-red-200 px-2 py-1 rounded">
                  ALERTA
                </span>
              )}
            </div>
            <div className={alertaBPM ? 'text-red-700' : 'text-gray-900'}>
              <span className="text-4xl font-bold">{dados.bpm}</span>
              <span className="text-xl ml-2">BPM</span>
            </div>
            {alertaBPM && (
              <p className="text-xs text-red-600 mt-2">
                ⚠️ Frequência cardíaca acima do normal
              </p>
            )}
          </div>

          {/* SpO2 */}
          <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="h-5 w-5 text-blue-500" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saturação de Oxigênio
              </span>
            </div>
            <div className="text-gray-900">
              <span className="text-4xl font-bold">{dados.spo2}</span>
              <span className="text-xl ml-2">%</span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${dados.spo2}%` }}
              ></div>
            </div>
          </div>

          {/* Velocidades X/Y/Z - ocupa 2 colunas */}
          <div className="md:col-span-2 bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Movimento (acelerômetro)
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {/* Velocidade X */}
              <div className="text-center bg-white rounded-lg border border-gray-200 p-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Eixo X
                </div>
                <div className="text-2xl font-bold text-gray-900">{dados.velocidadeX}</div>
                <div className="text-xs text-gray-500 mt-1">m/s</div>
              </div>
              
              {/* Velocidade Y */}
              <div className="text-center bg-white rounded-lg border border-gray-200 p-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Eixo Y
                </div>
                <div className="text-2xl font-bold text-gray-900">{dados.velocidadeY}</div>
                <div className="text-xs text-gray-500 mt-1">m/s</div>
              </div>
              
              {/* Velocidade Z */}
              <div className="text-center bg-white rounded-lg border border-gray-200 p-3">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Eixo Z
                </div>
                <div className="text-2xl font-bold text-gray-900">{dados.velocidadeZ}</div>
                <div className="text-xs text-gray-500 mt-1">m/s</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rodapé - Indicador de atualização */}
      <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
        <div className="flex items-center justify-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">
            Atualizando a cada 2 segundos
          </span>
        </div>
      </div>
    </div>
  );
}
