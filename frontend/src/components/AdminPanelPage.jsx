import React, { useState, useEffect } from 'react';
import { Shield, Server, Users, Trophy, Camera, Radio, CheckCircle, AlertCircle } from 'lucide-react';
import ErrorBanner from './ui/ErrorBanner.jsx';
import { apiFetch } from '../lib/api.js';

const AdminPanelPage = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/api/status');
        
        if (!response.ok) {
          let body = {};
          try { body = await response.json(); } catch {}
          throw new Error(body.error || response.statusText || 'Falha na solicitação');
        }
        
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleString('pt-BR');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-purple-500 p-3 rounded-full">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <p className="text-gray-600">Gerenciamento do sistema Copa PassaBola</p>
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Server className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Status do Backend</h2>
        </div>
        
        {loading && (
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Verificando status...</span>
          </div>
        )}

        {error && <ErrorBanner message={error} />}

        {status && !error && (
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <span className="text-green-700 font-medium">Backend OK</span>
              <span className="text-gray-500 ml-2">- {formatTime(status.time)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Times Inscritos</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Partidas</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fotos na Galeria</p>
              <p className="text-2xl font-bold text-gray-900">1</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Camera className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Jogos Ao Vivo</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <Radio className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Users className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-medium">Gerenciar Times</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Trophy className="h-5 w-5 text-blue-600" />
            <span className="text-blue-700 font-medium">Configurar Torneio</span>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Camera className="h-5 w-5 text-purple-600" />
            <span className="text-purple-700 font-medium">Gerenciar Galeria</span>
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900">Informação</h4>
            <p className="text-sm text-blue-700 mt-1">
              Este é um painel administrativo de demonstração. Use as credenciais admin@local / admin para acessar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
