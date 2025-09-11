import React, { useState } from 'react';
import { Trophy, Users, Camera, Radio, Menu, X, ChevronRight, MapPin, Calendar, Clock } from 'lucide-react';
import HomePage from './components/HomePage.jsx';
import RegistrationPage from './components/RegistrationPage.jsx';
import TournamentPage from './components/TournamentPage.jsx';
import GalleryPage from './components/GalleryPage.jsx';
import LivePanelPage from './components/LivePanelPage.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { id: 'home', name: 'Início', icon: Trophy },
    { id: 'registration', name: 'Inscrições', icon: Users },
    { id: 'tournament', name: 'Tabela', icon: Trophy },
    { id: 'gallery', name: 'Galeria', icon: Camera },
    { id: 'live', name: 'Ao Vivo', icon: Radio },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'registration':
        return <RegistrationPage />;
      case 'tournament':
        return <TournamentPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'live':
        return <LivePanelPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              <div className="bg-gradient-to-r from-green-500 to-purple-500 p-2 rounded-full">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Copa PassaBola</h1>
                <p className="text-sm text-gray-600">Futebol Feminino</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentPage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                      currentPage === item.id
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-purple-500 p-2 rounded-full">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Copa PassaBola</h3>
                  <p className="text-gray-400 text-sm">Futebol Feminino</p>
                </div>
              </div>
              <p className="text-gray-400">
                Valorizando o talento feminino no futebol, criando oportunidades e construindo comunidade.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Próximos Eventos</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Copa 2024: Março - Maio</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">Campo da Vila, São Paulo</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Sábados e Domingos</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contato</h4>
              <p className="text-gray-400 mb-2">
                Para dúvidas, sugestões ou parcerias:
              </p>
              <p className="text-green-400 font-medium">contato@copapassabola.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Copa PassaBola. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;