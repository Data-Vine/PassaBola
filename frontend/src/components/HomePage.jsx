import React from 'react';
import { Trophy, Users, Calendar, MapPin, Star, ChevronRight, Play, Target } from 'lucide-react';

const HomePage = ({ onNavigate }) => {
  const features = [
    {
      icon: Users,
      title: 'Inscrições Online',
      description: 'Cadastre seu time de forma rápida e segura',
      action: () => onNavigate('registration'),
      color: 'green'
    },
    {
      icon: Trophy,
      title: 'Tabela Atualizada',
      description: 'Acompanhe jogos, resultados e classificação',
      action: () => onNavigate('tournament'),
      color: 'purple'
    },
    {
      icon: Play,
      title: 'Transmissão Ao Vivo',
      description: 'Siga os jogos em tempo real',
      action: () => onNavigate('live'),
      color: 'orange'
    }
  ];

  const stats = [
    { number: '32', label: 'Times Participantes' },
    { number: '150+', label: 'Atletas' },
    { number: '48', label: 'Jogos na Temporada' },
    { number: '5', label: 'Anos de História' }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-green-500 to-purple-600 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
              Copa <span className="text-yellow-300">PassaBola</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50 max-w-3xl mx-auto">
              O maior torneio de futebol feminino. 
              Onde o talento encontra a oportunidade e os sonhos se tornam realidade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onNavigate('registration')}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Users className="h-5 w-5" />
                <span>Inscrever Time</span>
                <ChevronRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onNavigate('live')}
                className="bg-white/20 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/30 transition-all duration-300 border-2 border-white/30 flex items-center justify-center space-x-2"
              >
                <Play className="h-5 w-5" />
                <span>Ver Jogos Ao Vivo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tudo que Você Precisa
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Uma plataforma completa para participar, acompanhar e torcer pela Copa PassaBola
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorMap = {
              green: 'from-green-500 to-green-600',
              purple: 'from-purple-500 to-purple-600',
              orange: 'from-orange-500 to-orange-600'
            };
            
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
                onClick={feature.action}
              >
                  <div className={`bg-gradient-to-r ${colorMap[feature.color]} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <div className="flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors">
                  <span>Acessar</span>
                  <ChevronRight className="h-5 w-5 ml-2" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-green-500 to-purple-500 p-2 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Nossa Missão</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                A Copa PassaBola nasceu do sonho de valorizar o futebol feminino, 
                criando um espaço onde atletas talentosas podem brilhar, crescer e inspirar suas comunidades.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Mais que um torneio, somos uma plataforma de transformação social que usa o esporte 
                como ferramenta de empoderamento, inclusão e desenvolvimento pessoal.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                  <Star className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 font-medium">Inclusão</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-full">
                  <Star className="h-4 w-4 text-purple-600" />
                  <span className="text-purple-700 font-medium">Empoderamento</span>
                </div>
                <div className="flex items-center space-x-2 bg-orange-50 px-4 py-2 rounded-full">
                  <Star className="h-4 w-4 text-orange-600" />
                  <span className="text-orange-700 font-medium">Comunidade</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-purple-100 rounded-3xl p-8 text-center">
                <div className="text-6xl mb-4">⚽</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Próxima Copa 2024
                </h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Março - Maio 2024</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-5 w-5" />
                    <span>Campo da Vila, São Paulo</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>32 Times Participantes</span>
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('registration')}
                  className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-6 py-3 rounded-full font-bold hover:from-green-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 mt-6"
                >
                  Inscrever Time Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Faça Parte da História
          </h2>
          <p className="text-xl mb-8 text-green-50 max-w-2xl mx-auto">
            Junte-se a nós nesta jornada de transformação através do futebol feminino
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('registration')}
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
            >
              Inscrever Meu Time
            </button>
            <button 
              onClick={() => onNavigate('tournament')}
              className="bg-white/20 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white/30 transition-all duration-300 border-2 border-white/30"
            >
              Ver Tabela Completa
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;