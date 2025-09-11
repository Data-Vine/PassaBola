import React, { useState, useEffect } from 'react';
import { Radio, Play, Clock, MapPin, Users, Trophy, Target, AlertCircle, Calendar } from 'lucide-react';

const API_URL = 'http://localhost:5001'; // ajuste se necessário

const LivePanelPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch matches data
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Mock data - in real app, this would be fetch calls
        const mockLiveMatches = [
          { id: 1, tournament_id: 1, group_id: 1, round: 'quarterfinal', date: '2024-03-15', time: '15:00', venue: 'Campo da Vila', home_team_id: 1, away_team_id: 2, home_score: 1, away_score: 0, status: 'live', home_team: { name: 'Leoas da Vila' }, away_team: { name: 'Valkirias FC' } }
        ];
        
        const mockUpcomingMatches = [
          { id: 2, tournament_id: 1, group_id: 1, round: 'quarterfinal', date: '2024-03-15', time: '17:00', venue: 'Campo da Vila', home_team_id: 3, away_team_id: 4, home_score: 0, away_score: 0, status: 'scheduled', home_team: { name: 'Furacão Rosa' }, away_team: { name: 'Tigres do Sul' } },
          { id: 3, tournament_id: 1, group_id: 1, round: 'semifinal', date: '2024-03-16', time: '14:00', venue: 'Campo da Vila', home_team_id: null, away_team_id: null, home_score: 0, away_score: 0, status: 'scheduled', home_team: null, away_team: null },
        ];
        
        setLiveMatches(mockLiveMatches);
        setUpcomingMatches(mockUpcomingMatches);
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMatches, 30000);
    return () => clearInterval(interval);
  }, []);

  // Live Match Component with mock realtime updates
  const LiveMatchCard = ({ match }) => {
    // Mock realtime data - in real app, this would use WebSocket or polling
    const mockEvents = [
      { id: 1, match_id: match.id, minute: '15', type: 'goal', description: 'Gol de Maria Silva!' },
      { id: 2, match_id: match.id, minute: '23', type: 'yellow', description: 'Cartão amarelo para Ana Costa' },
    ];
    const currentMatch = match;
    const events = mockEvents;

    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-purple-500 px-6 py-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5" />
              <span className="font-medium">{currentMatch.venue}</span>
            </div>
            {getStatusBadge(currentMatch.status)}
          </div>
        </div>

        <div className="p-6">
          {/* Score Display */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 text-center">
              <div className="font-bold text-xl text-gray-900 mb-2">{currentMatch.home_team?.name}</div>
              <div className="text-4xl font-bold text-green-600">{currentMatch.home_score}</div>
            </div>
            
            <div className="px-6 text-center">
              <div className="text-3xl font-bold text-gray-400 mb-2">x</div>
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                {currentMatch.status === 'live' ? 'AO VIVO' : 
                 currentMatch.status === 'halftime' ? 'INTERVALO' : 'FINALIZADO'}
              </div>
            </div>
            
            <div className="flex-1 text-center">
              <div className="font-bold text-xl text-gray-900 mb-2">{currentMatch.away_team?.name}</div>
              <div className="text-4xl font-bold text-green-600">{currentMatch.away_score}</div>
            </div>
          </div>

          {/* Live Events */}
          <div className="border-t pt-4">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Principais Lances</span>
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {events.slice().reverse().map(event => (
                <div key={event.id} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-xl">{getEventIcon(event.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-bold text-green-600">{event.minute}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <p className="text-gray-500 text-center py-4">Nenhum evento registrado ainda</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      live: 'bg-red-100 text-red-800 animate-pulse',
      halftime: 'bg-yellow-100 text-yellow-800',
      finished: 'bg-green-100 text-green-800'
    };
    
    const labels = {
      live: 'AO VIVO',
      halftime: 'INTERVALO',
      finished: 'FINALIZADO'
    };
    
      return (
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status]}`}>
          {labels[status]}
        </span>
      );
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'goal':
        return '⚽';
      case 'yellow':
        return '🟨';
      case 'red':
        return '🟥';
      case 'substitution':
        return '🔄';
      case 'start':
        return '▶️';
      case 'end':
        return '⏸️';
      default:
        return '📝';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full animate-pulse">
            <Radio className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Painel Ao Vivo</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Acompanhe os jogos da Copa PassaBola em tempo real com atualizações instantâneas
        </p>
      </div>

      {/* Live Status Bar */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex items-center space-x-3 mb-2 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold">QUARTAS DE FINAL - AO VIVO</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-90">Atualização em tempo real</div>
            <div className="font-mono text-lg">
              {currentTime.toLocaleTimeString('pt-BR')}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Live Matches */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <Play className="h-6 w-6 text-red-500" />
            <span>Jogos Ao Vivo</span>
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando jogos ao vivo...</p>
            </div>
          ) : liveMatches.length > 0 ? (
            liveMatches.map(match => (
              <LiveMatchCard key={match.id} match={match} />
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Radio className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Nenhum jogo ao vivo no momento</p>
              <p>Acompanhe os próximos jogos abaixo</p>
            </div>
          )}

          {/* Upcoming Matches */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Clock className="h-6 w-6 text-blue-500" />
              <span>Próximos Jogos</span>
            </h2>

            <div className="space-y-4">
              {upcomingMatches.map(match => (
                <div key={match.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 text-center">
                      <div className="font-bold text-lg text-gray-900">{match.home_team?.name || 'TBD'}</div>
                    </div>
                    
                    <div className="px-6 text-center">
                      <div className="text-2xl font-bold text-gray-400 mb-1">vs</div>
                      <div className="text-sm text-gray-600">{match.time || 'TBD'}</div>
                    </div>
                    
                    <div className="flex-1 text-center">
                      <div className="font-bold text-lg text-gray-900">{match.away_team?.name || 'TBD'}</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{match.date || 'TBD'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{match.venue || 'TBD'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Live Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <span>Atualizações Recentes</span>
            </h3>
            
            <div className="space-y-3">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm ${
                      index === 0 ? 'bg-orange-50 border border-orange-200' : 'bg-gray-50'
                    } ${index === 0 ? 'animate-pulse' : ''}`}
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-orange-500 font-bold">•</span>
                      <span className="text-gray-800">{notification}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Há {index === 0 ? 'poucos' : (index + 1) * 2} minutos
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Radio className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Aguardando atualizações...</p>
                </div>
              )}
            </div>
          </div>

          {/* Tournament Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              <span>Estatísticas</span>
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">Jogos Realizados</span>
                <span className="font-bold text-green-600">26</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-gray-700">Gols Marcados</span>
                <span className="font-bold text-purple-600">89</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700">Times Restantes</span>
                <span className="font-bold text-orange-600">8</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700">Público Total</span>
                <span className="font-bold text-blue-600">2.847</span>
              </div>
            </div>
          </div>

          {/* Top Scorers */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-red-500" />
              <span>Artilheiras</span>
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <div className="font-bold text-gray-900">Maria Silva</div>
                  <div className="text-sm text-gray-600">Leoas da Vila</div>
                </div>
                <div className="text-2xl font-bold text-yellow-600">8</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-gray-900">Ana Costa</div>
                  <div className="text-sm text-gray-600">Valkirias FC</div>
                </div>
                <div className="text-xl font-bold text-gray-600">7</div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-bold text-gray-900">Carla Santos</div>
                  <div className="text-sm text-gray-600">Furacão Rosa</div>
                </div>
                <div className="text-xl font-bold text-gray-600">6</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePanelPage;