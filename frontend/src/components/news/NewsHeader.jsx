import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';

function NewsHeader() {
  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-green-500 to-purple-500 p-2 rounded-full">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Copa PassaBola</h1>
              <p className="text-sm text-gray-600">Hub de Notícias</p>
            </div>
          </Link>

          {/* Botão Copa */}
          <Link 
            to="/copa"
            className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
          >
            Copa Passa a Bola
          </Link>
        </div>
      </div>
    </header>
  );
}

export default NewsHeader;