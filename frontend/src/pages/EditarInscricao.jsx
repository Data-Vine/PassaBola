import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Save, Trash2, ArrowLeft, AlertCircle, UserPlus, X } from "lucide-react";
import {
  obterMinhaInscricao,
  criarMinhaInscricao,
  editarMinhaInscricao,
  excluirMinhaInscricao,
} from "../lib/api";

export default function EditarInscricao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdicao = !!id;

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);
  const [inscricao, setInscricao] = useState(null);

  // Form state
  const [time, setTime] = useState({ nome: "", cidade: "" });
  const [responsavel, setResponsavel] = useState({
    nome: "",
    cpf: "",
    telefone: "",
    email: "",
  });
  const [atletas, setAtletas] = useState([
    { nome: "", dataNascimento: "", cpf: "", posicao: "" },
  ]);

  useEffect(() => {
    if (isEdicao) {
      carregarInscricao();
    }
  }, [id]);

  async function carregarInscricao() {
    try {
      setLoading(true);
      const data = await obterMinhaInscricao(id);
      setInscricao(data);
      setTime(data.time || { nome: "", cidade: "" });
      setResponsavel(data.responsavel || { nome: "", cpf: "", telefone: "", email: "" });
      setAtletas(data.atletas || [{ nome: "", dataNascimento: "", cpf: "", posicao: "" }]);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  function adicionarAtleta() {
    setAtletas([...atletas, { nome: "", dataNascimento: "", cpf: "", posicao: "" }]);
  }

  function removerAtleta(index) {
    if (atletas.length > 1) {
      setAtletas(atletas.filter((_, i) => i !== index));
    }
  }

  function atualizarAtleta(index, campo, valor) {
    const novosAtletas = [...atletas];
    novosAtletas[index][campo] = valor;
    setAtletas(novosAtletas);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro(null);

    // Validação básica
    if (!time.nome.trim()) {
      setErro("Nome do time é obrigatório");
      return;
    }

    if (!responsavel.nome.trim()) {
      setErro("Nome do responsável é obrigatório");
      return;
    }

    if (atletas.length === 0 || !atletas[0].nome.trim()) {
      setErro("Deve haver pelo menos uma atleta");
      return;
    }

    const payload = { time, responsavel, atletas };

    try {
      setLoading(true);
      if (isEdicao) {
        await editarMinhaInscricao(id, payload);
      } else {
        await criarMinhaInscricao(payload);
      }
      navigate("/copa/minhas-inscricoes");
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleExcluir() {
    if (!confirm("Deseja realmente excluir esta inscrição?")) {
      return;
    }

    try {
      setLoading(true);
      await excluirMinhaInscricao(id);
      navigate("/copa/minhas-inscricoes");
    } catch (err) {
      setErro(err.message);
      setLoading(false);
    }
  }

  const isAprovadaOuReprovada = inscricao && inscricao.status !== "pendente";
  const desabilitado = loading || isAprovadaOuReprovada;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/copa/minhas-inscricoes"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para minhas inscrições
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEdicao ? "Editar Inscrição" : "Nova Inscrição"}
        </h1>
        {inscricao && (
          <div className="mt-2">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                inscricao.status === "pendente"
                  ? "bg-yellow-100 text-yellow-800"
                  : inscricao.status === "aprovado"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              Status: {inscricao.status}
            </span>
          </div>
        )}
      </div>

      {/* Aviso para inscrições não-pendentes */}
      {isAprovadaOuReprovada && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
          <p className="text-blue-800">
            Esta inscrição não pode ser editada porque já foi {inscricao.status}.
          </p>
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-red-800">{erro}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Time */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Dados do Time</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Time *
              </label>
              <input
                type="text"
                required
                disabled={desabilitado}
                value={time.nome}
                onChange={(e) => setTime({ ...time, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade
              </label>
              <input
                type="text"
                disabled={desabilitado}
                value={time.cidade}
                onChange={(e) => setTime({ ...time, cidade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Responsável */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsável</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo *
              </label>
              <input
                type="text"
                required
                disabled={desabilitado}
                value={responsavel.nome}
                onChange={(e) => setResponsavel({ ...responsavel, nome: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                type="text"
                disabled={desabilitado}
                value={responsavel.cpf}
                onChange={(e) => setResponsavel({ ...responsavel, cpf: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <input
                type="tel"
                disabled={desabilitado}
                value={responsavel.telefone}
                onChange={(e) =>
                  setResponsavel({ ...responsavel, telefone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                disabled={desabilitado}
                value={responsavel.email}
                onChange={(e) => setResponsavel({ ...responsavel, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* Atletas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Atletas</h2>
            {!desabilitado && (
              <button
                type="button"
                onClick={adicionarAtleta}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
              >
                <UserPlus className="h-4 w-4" />
                Adicionar Atleta
              </button>
            )}
          </div>

          <div className="space-y-4">
            {atletas.map((atleta, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg relative"
              >
                {!desabilitado && atletas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removerAtleta(index)}
                    className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      required
                      disabled={desabilitado}
                      value={atleta.nome}
                      onChange={(e) => atualizarAtleta(index, "nome", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      disabled={desabilitado}
                      value={atleta.dataNascimento}
                      onChange={(e) =>
                        atualizarAtleta(index, "dataNascimento", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CPF
                    </label>
                    <input
                      type="text"
                      disabled={desabilitado}
                      value={atleta.cpf}
                      onChange={(e) => atualizarAtleta(index, "cpf", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Posição
                    </label>
                    <input
                      type="text"
                      disabled={desabilitado}
                      value={atleta.posicao}
                      onChange={(e) => atualizarAtleta(index, "posicao", e.target.value)}
                      placeholder="Ex: Goleira, Atacante..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center justify-between">
          <div>
            {isEdicao && inscricao?.status === "pendente" && (
              <button
                type="button"
                onClick={handleExcluir}
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Excluir Inscrição
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/copa/minhas-inscricoes"
              className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </Link>
            {!isAprovadaOuReprovada && (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {loading ? "Salvando..." : "Salvar"}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
