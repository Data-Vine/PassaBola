import React, { useState } from 'react';
import { Routes, Route, Navigate, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { Trophy, Users, Camera, Radio, Menu, X, ChevronRight, MapPin, Calendar, Clock, LogIn, Shield, LogOut, Newspaper } from 'lucide-react';
import HomePage from '../components/HomePage.jsx';
import RegistrationPage from '../components/RegistrationPage.jsx';
import TournamentPage from '../components/TournamentPage.jsx';
import GalleryPage from '../components/GalleryPage.jsx';
import LivePanelPage from '../components/LivePanelPage.jsx';
import LoginPage from '../components/LoginPage.jsx';
import AdminPanelPage from '../components/AdminPanelPage.jsx';
import RequireAuth from '../components/RequireAuth.jsx';

function CopaApp() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'));

  // Helper para gerar caminhos absolutos da Copa
  const copaPath = (p = '') => `/copa/${String(p).replace(/^\/+/, '')}`;

  const navigation = [
    { id: 'home', name: 'Início', icon: Trophy, path: copaPath('') },
    { id: 'registration', name: 'Inscrições', icon: Users, path: copaPath('registration') },
    { id: 'tournament', name: 'Tabela', icon: Trophy, path: copaPath('tournament') },
    { id: 'gallery', name: 'Galeria', icon: Camera, path: copaPath('gallery') },
    { id: 'live', name: 'Ao Vivo', icon: Radio, path: copaPath('live') },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <NavLink to={copaPath()} className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-500 to-purple-500 p-2 rounded-full">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Copa PassaBola</h1>
                <p className="text-sm text-gray-600">Futebol Feminino</p>
              </div>
            </NavLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              
              {/* Botão Notícias */}
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl border border-green-200 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50 transition"
                aria-label="Ir para o Hub de Notícias"
              >
                <Newspaper className="h-4 w-4" />
                Notícias
              </Link>
            </nav>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <NavLink
                    to={copaPath('admin')}
                    end
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                        isActive
                          ? 'text-purple-600 bg-purple-50'
                          : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                      }`
                    }
                  >
                    <Shield className="h-4 w-4" />
                    <span>Painel</span>
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <NavLink
                  to={copaPath('login')}
                  end
                  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </NavLink>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-4 py-3 space-y-2">
              {navigation.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
              
              {/* Botão Notícias Mobile */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg font-medium text-green-700 border border-green-200 hover:bg-green-50 transition-colors"
                aria-label="Ir para o Hub de Notícias"
              >
                <Newspaper className="h-5 w-5" />
                <span>Notícias</span>
              </Link>
              
              <div className="border-t border-gray-200 pt-2 mt-2">
                {isLoggedIn ? (
                  <>
                    <NavLink
                      to={copaPath('admin')}
                      end
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                          isActive
                            ? 'text-purple-600 bg-purple-50'
                            : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                        }`
                      }
                    >
                      <Shield className="h-5 w-5" />
                      <span>Painel Admin</span>
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-3 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sair</span>
                    </button>
                  </>
                ) : (
                  <NavLink
                    to={copaPath('login')}
                    end
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Login</span>
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="registration" element={<RegistrationPage />} />
        <Route path="tournament" element={<TournamentPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="live" element={<LivePanelPage />} />
        <Route path="login" element={<LoginPage onLogin={() => setIsLoggedIn(true)} />} />
        <Route 
          path="admin" 
          element={
            <RequireAuth>
              <AdminPanelPage />
            </RequireAuth>
          } 
        />
      </Routes>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-green-500 to-purple-500 p-2 rounded-full">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Copa PassaBola</h3>
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

export default CopaApp;