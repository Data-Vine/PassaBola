import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, MapPin, Calendar, Trophy, CheckCircle, AlertCircle, Upload, FileText, Camera, User } from 'lucide-react';
import ErrorBanner from './ui/ErrorBanner.jsx';

const API = 'http://localhost:5001/api';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    teamName: '',
    coachName: '',
    coachEmail: '',
    coachPhone: '',
    playerCount: '',
    neighborhood: '',
    foundationYear: '',
    experience: '',
    expectations: ''
  });
  
  const [players, setPlayers] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsError, setTeamsError] = useState('');

  // Fetch teams on mount
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setTeamsLoading(true);
        const response = await fetch(`${API}/teams`);
        
        if (!response.ok) {
          let body = {};
          try { body = await response.json(); } catch {}
          throw new Error(body.error || response.statusText || 'Falha na solicitação');
        }
        
        const data = await response.json();
        setTeams(data);
      } catch (err) {
        setTeamsError(err.message);
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  // Validation helpers
  function validateCPF(cpf) {
    const cleanCPF = cpf.replace(/\D/g, '');
    
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false; // All same digits
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF[i]) * (10 - i);
    }
    let digit1 = (sum * 10) % 11;
    if (digit1 === 10) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF[i]) * (11 - i);
    }
    sum += digit1 * 2;
    let digit2 = (sum * 10) % 11;
    if (digit2 === 10) digit2 = 0;
    
    return parseInt(cleanCPF[9]) === digit1 && parseInt(cleanCPF[10]) === digit2;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addPlayer = () => {
    const newPlayer = {
      id: Date.now(),
      name: '',
      rg: '',
      cpf: '',
      birthDate: '',
      position: '',
      photo: null
    };
    setPlayers(prev => [...prev, newPlayer]);
  };

  const updatePlayer = (id, field, value) => {
    setPlayers(prev => prev.map(player => 
      player.id === id ? { ...player, [field]: value } : player
    ));
  };

  const removePlayer = (id) => {
    setPlayers(prev => prev.filter(player => player.id !== id));
  };

  const handlePhotoUpload = (playerId, file) => {
    updatePlayer(playerId, 'photo', file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsLoading(true);
    
    try {
      // Validate required fields
      if (!formData.teamName.trim()) {
        setSubmitError('Nome do time é obrigatório');
        setIsLoading(false);
        return;
      }

      if (players.length === 0) {
        setSubmitError('Pelo menos uma jogadora deve ser cadastrada');
        setIsLoading(false);
        return;
      }

      // Validate CPFs
      for (const player of players) {
        if (!validateCPF(player.cpf)) {
          setSubmitError(`CPF inválido para ${player.name}`);
          setIsLoading(false);
          return;
        }
      }

      // Submit team registration
      const response = await fetch(`${API}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.teamName,
          city: formData.neighborhood || null,
        }),
      });

      if (!response.ok) {
        let body = {};
        try { body = await response.json(); } catch {}
        throw new Error(body.error || response.statusText || 'Falha na solicitação');
      }

      const newTeam = await response.json();
      setTeams(prev => [...prev, newTeam]);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error.message);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Inscrição Realizada!
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Parabéns! Seu time <strong>{formData.teamName}</strong> foi inscrito com sucesso na Copa PassaBola 2024.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-green-800 mb-2">Próximos Passos:</h3>
              <ul className="text-left text-green-700 space-y-2">
                <li>• Sua inscrição está sendo analisada pela organização</li>
                <li>• Você será notificado sobre a aprovação em breve</li>
                <li>• O sorteio dos grupos será após aprovação de todos os times</li>
                <li>• Todas as informações foram processadas automaticamente</li>
              </ul>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-8 py-3 rounded-full font-bold hover:from-green-600 hover:to-purple-600 transition-all duration-300"
            >
              Inscrever Outro Time
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-purple-500 p-3 rounded-full">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Inscrição de Times</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Inscreva seu time na Copa PassaBola 2024 e faça parte da maior competição de futebol feminino
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                currentStep >= step 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  currentStep > step ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4 space-x-8 text-sm">
          <span className={currentStep >= 1 ? 'text-green-600 font-medium' : 'text-gray-500'}>
            Dados do Time
          </span>
          <span className={currentStep >= 2 ? 'text-green-600 font-medium' : 'text-gray-500'}>
            Jogadoras
          </span>
          <span className={currentStep >= 3 ? 'text-green-600 font-medium' : 'text-gray-500'}>
            Confirmação
          </span>
        </div>
      </div>

      {/* Registration Info */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-yellow-800 mb-2">Informações Importantes</h3>
            <ul className="text-yellow-700 space-y-1 text-sm">
              <li>• Inscrições abertas até <strong>31 de janeiro de 2024</strong></li>
              <li>• Times devem ter entre <strong>16 e 22 jogadoras</strong></li>
              <li>• Idades entre <strong>16 e 35 anos</strong></li>
              <li>• Toda documentação é processada digitalmente</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Team Data */}
        {currentStep === 1 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Trophy className="h-6 w-6 text-green-600" />
              <span>Dados do Time</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Time *
                </label>
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  required
                  value={formData.teamName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ex: Leoas da Vila"
                />
              </div>
              
              <div>
                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro/Região *
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  name="neighborhood"
                  required
                  value={formData.neighborhood}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ex: Vila Madalena"
                />
              </div>
              
              <div>
                <label htmlFor="foundationYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Ano de Fundação
                </label>
                <input
                  type="number"
                  id="foundationYear"
                  name="foundationYear"
                  value={formData.foundationYear}
                  onChange={handleInputChange}
                  min="1980"
                  max="2024"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Ex: 2020"
                />
              </div>
              
              <div>
                <label htmlFor="playerCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Jogadoras *
                </label>
                <select
                  id="playerCount"
                  name="playerCount"
                  required
                  value={formData.playerCount}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                >
                  <option value="">Selecione</option>
                  <option value="16-18">16 a 18 jogadoras</option>
                  <option value="19-20">19 a 20 jogadoras</option>
                  <option value="21-22">21 a 22 jogadoras</option>
                </select>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span>Dados do Técnico/Responsável</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="coachName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    id="coachName"
                    name="coachName"
                    required
                    value={formData.coachName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Nome do técnico ou responsável"
                  />
                </div>
                
                <div>
                  <label htmlFor="coachEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="coachEmail"
                    name="coachEmail"
                    required
                    value={formData.coachEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="email@exemplo.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="coachPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="coachPhone"
                    name="coachPhone"
                    required
                    value={formData.coachPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Experiência no Futebol
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  >
                    <option value="">Selecione</option>
                    <option value="beginner">Iniciante (menos de 1 ano)</option>
                    <option value="intermediate">Intermediário (1-3 anos)</option>
                    <option value="experienced">Experiente (3-5 anos)</option>
                    <option value="veteran">Veterano (mais de 5 anos)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <label htmlFor="expectations" className="block text-sm font-medium text-gray-700 mb-2">
                O que vocês esperam da Copa PassaBola? (Opcional)
              </label>
              <textarea
                id="expectations"
                name="expectations"
                rows={4}
                value={formData.expectations}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                placeholder="Compartilhe suas expectativas, objetivos ou história do time..."
              />
            </div>
          </div>
        )}

        {/* Step 2: Players */}
        {currentStep === 2 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <User className="h-6 w-6 text-green-600" />
                <span>Cadastro das Jogadoras</span>
              </h2>
              <button
                type="button"
                onClick={addPlayer}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Adicionar Jogadora</span>
              </button>
            </div>

            <div className="space-y-6">
              {players.map((player, index) => (
                <div key={player.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Jogadora #{index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removePlayer(player.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remover
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={player.name}
                        onChange={(e) => updatePlayer(player.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Nome da jogadora"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        RG *
                      </label>
                      <input
                        type="text"
                        required
                        value={player.rg}
                        onChange={(e) => updatePlayer(player.id, 'rg', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="00.000.000-0"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CPF *
                      </label>
                      <input
                        type="text"
                        required
                        value={player.cpf}
                        onChange={(e) => updatePlayer(player.id, 'cpf', e.target.value)}
                        onBlur={(e) => {
                          const isValid = validateCPF(e.target.value);
                          e.target.style.borderColor = isValid ? '' : '#ef4444';
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Data de Nascimento *
                      </label>
                      <input
                        type="date"
                        required
                        value={player.birthDate}
                        onChange={(e) => updatePlayer(player.id, 'birthDate', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Posição *
                      </label>
                      <select
                        required
                        value={player.position}
                        onChange={(e) => updatePlayer(player.id, 'position', e.target.value.toUpperCase())}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Selecione</option>
                        <option value="GOL">Goleira</option>
                        <option value="DEF">Defensora</option>
                        <option value="MEI">Meio-campo</option>
                        <option value="ATA">Atacante</option>
                        <option value="OUTROS">Outros</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Foto 3x4 *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoUpload(player.id, file);
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {players.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">Nenhuma jogadora cadastrada</p>
                  <p>Clique em "Adicionar Jogadora" para começar</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span>Confirmação dos Dados</span>
            </h2>
            
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Dados do Time</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><strong>Nome:</strong> {formData.teamName}</div>
                  <div><strong>Bairro:</strong> {formData.neighborhood}</div>
                  <div><strong>Técnico:</strong> {formData.coachName}</div>
                  <div><strong>Email:</strong> {formData.coachEmail}</div>
                  <div><strong>WhatsApp:</strong> {formData.coachPhone}</div>
                  <div><strong>Jogadoras:</strong> {players.length}</div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Jogadoras Cadastradas</h3>
                <div className="space-y-2">
                  {players.map((player, index) => (
                    <div key={player.id} className="flex justify-between items-center text-sm">
                      <span>{index + 1}. {player.name}</span>
                      <span className="text-gray-600">{player.position}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-800 mb-2">Processamento Automático</h3>
                <ul className="text-green-700 space-y-1 text-sm">
                  <li>• Todas as informações serão processadas automaticamente</li>
                  <li>• Documentos digitais validados pelo sistema</li>
                  <li>• Confirmação por email em até 24 horas</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {submitError && <ErrorBanner message={submitError} />}
        {teamsError && <ErrorBanner message={teamsError} />}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-500 text-white px-6 py-3 rounded-full font-bold hover:bg-gray-600 transition-all duration-300"
            >
              Voltar
            </button>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={nextStep}
              className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold hover:from-green-600 hover:to-purple-600 transition-all duration-300 ml-auto"
            >
              Próximo
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading || players.length === 0}
              className={`bg-gradient-to-r from-green-500 to-purple-500 text-white px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 transform hover:scale-105 ml-auto ${
                isLoading || players.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-600 hover:to-purple-600'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Processando...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Confirmar Inscrição</span>
                </div>
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;