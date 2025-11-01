import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Plus, Edit, Trash2, Eye, AlertCircle, User, Activity } from "lucide-react";
import { listarMinhasInscricoes, excluirMinhaInscricao } from "../lib/api";
import PainelIot from "../components/PainelIot";

export default function MinhasInscricoes() {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    carregarInscricoes();
  }, []);

  async function carregarInscricoes() {
    try {
      setLoading(true);
      setErro(null);
      const data = await listarMinhasInscricoes();
      setInscricoes(Array.isArray(data) ? data : []);
    } catch (err) {
      setErro(err.message || "Erro ao carregar inscrições");
      setInscricoes([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleExcluir(id, nomeTime) {
    if (!confirm(`Deseja excluir a inscrição do time "${nomeTime}"?`)) {
      return;
    }

    try {
      await excluirMinhaInscricao(id);
      setInscricoes(inscricoes.filter((i) => i.id !== id));
    } catch (err) {
      alert(err.message || "Erro ao excluir");
    }
  }

  function getStatusBadge(status) {
    const styles = {
      pendente: "bg-yellow-100 text-yellow-800",
      aprovado: "bg-green-100 text-green-800",
      reprovado: "bg-red-100 text-red-800",
    };
    return styles[status] || styles.pendente;
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <User className="h-8 w-8 text-green-600" />
          Área do Usuário
        </h1>
        <p className="text-gray-600 mt-1">
          Gerencie suas inscrições e acompanhe o monitoramento físico
        </p>
      </div>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="h-6 w-6 text-green-600" />
              Minhas Inscrições
            </h2>
            <p className="text-gray-600 mt-1 text-sm">Inscrições na Copa PassaBola</p>
          </div>
          <Link to="/copa/inscricao/nova" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
            <Plus className="h-5 w-5" />
            Nova Inscrição
          </Link>
        </div>

        {erro && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{erro}</p>
          </div>
        )}

        {inscricoes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma inscrição ainda</h3>
            <p className="text-gray-600 mb-6">Comece criando sua primeira inscrição para a Copa PassaBola</p>
            <Link to="/copa/inscricao/nova" className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
              <Plus className="h-5 w-5" />
              Criar Inscrição
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado em</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inscricoes.map((inscricao) => (
                  <tr key={inscricao.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{inscricao.time?.nome || "Sem nome"}</div>
                      <div className="text-sm text-gray-500">{inscricao.atletas?.length || 0} atletas</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(inscricao.status)}`}>
                        {inscricao.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(inscricao.criadoEm).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/copa/inscricao/${inscricao.id}`} className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50" title="Ver detalhes">
                          <Eye className="h-4 w-4" />
                        </Link>
                        {inscricao.status === "pendente" && (
                          <>
                            <Link to={`/copa/inscricao/${inscricao.id}`} className="text-green-600 hover:text-green-900 p-2 rounded hover:bg-green-50" title="Editar">
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button onClick={() => handleExcluir(inscricao.id, inscricao.time?.nome)} className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50" title="Excluir">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Activity className="h-6 w-6 text-green-600" />
            Monitoramento Físico (protótipo)
          </h2>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">
            Monitoramento em tempo quase real dos sinais capturados pelo dispositivo <span className="font-semibold">ESP32</span> (BPM, SpO₂, movimento). 
            Nesta fase do projeto os valores são simulados, mas a interface e a arquitetura já estão prontas para receber dados reais via <span className="font-mono text-green-700">FIWARE</span>.
          </p>
        </div>
        <PainelIot />
      </section>
    </div>
  );
}
