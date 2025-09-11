import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Clock, MapPin, Users, Target, Award, ChevronDown, ChevronUp } from 'lucide-react';

const API_URL = 'http://localhost:5001'; // ajuste se necessário

const TournamentPage = () => {
  const [selectedGroup, setSelectedGroup] = useState('A');
  const [selectedRound, setSelectedRound] = useState('group');
  const [expandedMatch, setExpandedMatch] = useState(null);
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Mock data - in real app, this would be fetch calls
        const mockStandings = [
          { group_id: 1, team_id: 1, team_name: 'Leoas da Vila', played: 3, won: 3, drawn: 0, lost: 0, gf: 8, ga: 2, gd: 6, points: 9 },
          { group_id: 1, team_id: 2, team_name: 'Valkirias FC', played: 3, won: 2, drawn: 1, lost: 0, gf: 7, ga: 1, gd: 6, points: 7 },
          { group_id: 1, team_id: 3, team_name: 'Furacão Rosa', played: 3, won: 1, drawn: 0, lost: 2, gf: 4, ga: 6, gd: -2, points: 3 },
          { group_id: 1, team_id: 4, team_name: 'Tigres do Sul', played: 3, won: 0, drawn: 1, lost: 2, gf: 2, ga: 12, gd: -10, points: 1 },
        ];
        
        const mockMatches = [
          { id: 1, tournament_id: 1, group_id: 1, round: 'group', date: '2024-03-15', time: '14:00', venue: 'Campo da Vila', home_team_id: 1, away_team_id: 2, home_score: 2, away_score: 1, status: 'finished', home_team: { name: 'Leoas da Vila' }, away_team: { name: 'Valkirias FC' } },
          { id: 2, tournament_id: 1, group_id: 1, round: 'group', date: '2024-03-15', time: '16:00', venue: 'Campo da Vila', home_team_id: 3, away_team_id: 4, home_score: 1, away_score: 0, status: 'finished', home_team: { name: 'Furacão Rosa' }, away_team: { name: 'Tigres do Sul' } },
        ];
        
        setStandings(mockStandings);
        setMatches(mockMatches);
      } catch (error) {
        console.error('Error fetching tournament data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedRound]);

  const getTeamsByGroup = (groupId) => {
    return standings.filter(team => team.group_id === groupId);
  };

  const getMatchesByRound = () => {
    return matches;
  };

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: 'bg-blue-100 text-blue-800',
      live: 'bg-red-100 text-red-800 animate-pulse',
      finished: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      scheduled: 'Agendado',
      live: 'Ao Vivo',
      finished: 'Finalizado'
    };
    
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
          {labels[status]}
        </span>
      );
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-purple-500 p-3 rounded-full">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Tabela da Copa</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Acompanhe classificação, jogos e resultados da Copa PassaBola 2024
        </p>
      </div>

      {/* Tournament Status */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-yellow-800 mb-2">Fase Atual: Quartas de Final</h3>
            <p className="text-yellow-700">Os 8 melhores times estão classificados. Próximos jogos: 15 e 16 de março</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-800">8</div>
              <div className="text-xs text-yellow-600">Times Classificados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-800">24</div>
              <div className="text-xs text-yellow-600">Jogos Realizados</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedRound('group')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedRound === 'group'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
          }`}
        >
          Fase de Grupos
        </button>
        <button
          onClick={() => setSelectedRound('quarterfinal')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedRound === 'quarterfinal'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
          }`}
        >
          Quartas de Final
        </button>
        <button
          onClick={() => setSelectedRound('semifinal')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedRound === 'semifinal'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
          }`}
        >
          Semifinais
        </button>
        <button
          onClick={() => setSelectedRound('final')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            selectedRound === 'final'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
          }`}
        >
          Final
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {loading ? (
          <div className="lg:col-span-2 text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do torneio...</p>
          </div>
        ) : (
          <>
        {/* Classification Tables */}
        {selectedRound === 'group' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Classificação dos Grupos</h2>
            
            {/* Group Selection */}
            <div className="flex space-x-2 mb-6">
              {[1, 2, 3, 4].map((groupId, index) => (
                <button
                  key={groupId}
                  onClick={() => setSelectedGroup(String.fromCharCode(65 + index))}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedGroup === String.fromCharCode(65 + index)
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                  }`}
                >
                  Grupo {String.fromCharCode(65 + index)}
                </button>
              ))}
            </div>

            {/* Group Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white">Grupo {selectedGroup}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">J</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">V</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">E</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">D</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GP</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">GC</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SG</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Pts</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getTeamsByGroup(selectedGroup.charCodeAt(0) - 64).map((team, index) => (
                      <tr key={team.team_id} className={index < 2 ? 'bg-green-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                            index < 2 ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{team.team_name}</div>
                          {index < 2 && <div className="text-xs text-green-600 font-medium">Classificado</div>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.played}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.won}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.drawn}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.lost}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.gf}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">{team.ga}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {team.gd > 0 ? '+' : ''}{team.gd}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-lg font-bold text-gray-900">{team.points}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Matches */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedRound === 'group' ? 'Próximos Jogos' : 
             selectedRound === 'quarterfinal' ? 'Quartas de Final' :
             selectedRound === 'semifinal' ? 'Semifinais' : 'Final'}
          </h2>
          
          <div className="space-y-4">
            {getMatchesByRound().map((match) => (
              <div key={match.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{match.date}</span>
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">{match.time}</span>
                    </div>
                    {getStatusBadge(match.status)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <div className="font-bold text-lg text-gray-900 mb-1">{match.home_team?.name || 'TBD'}</div>
                      {match.status !== 'scheduled' && (
                        <div className="text-3xl font-bold text-green-600">{match.home_score}</div>
                      )}
                    </div>
                    
                    <div className="px-4">
                      <div className="text-2xl font-bold text-gray-400">
                        {match.status === 'finished' || match.status === 'live' || match.status === 'halftime' ? 'x' : 'vs'}
                      </div>
                    </div>
                    
                    <div className="flex-1 text-center">
                      <div className="font-bold text-lg text-gray-900 mb-1">{match.away_team?.name || 'TBD'}</div>
                      {match.status !== 'scheduled' && (
                        <div className="text-3xl font-bold text-green-600">{match.away_score}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{match.venue}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
          </>
        )}
      </div>

      {/* Statistics */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="h-8 w-8" />
            <h3 className="text-xl font-bold">Artilharia</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Maria Silva (Leoas da Vila)</span>
              <span className="text-2xl font-bold">8 gols</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span>Ana Costa (Valkirias FC)</span>
              <span className="text-lg font-bold">7 gols</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span>Carla Santos (Furacão Rosa)</span>
              <span className="text-lg font-bold">6 gols</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Award className="h-8 w-8" />
            <h3 className="text-xl font-bold">Melhor Defesa</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Valkirias FC</span>
              <span className="text-2xl font-bold">1 gol</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span>Leoas da Vila</span>
              <span className="text-lg font-bold">2 gols</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span>Tigres do Sul</span>
              <span className="text-lg font-bold">3 gols</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="h-8 w-8" />
            <h3 className="text-xl font-bold">Melhor Ataque</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Valkirias FC</span>
              <span className="text-2xl font-bold">9 gols</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span>Leoas da Vila</span>
              <span className="text-lg font-bold">8 gols</span>
            </div>
            <div className="flex justify-between items-center opacity-80">
              <span>Tigres do Sul</span>
              <span className="text-lg font-bold">8 gols</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;