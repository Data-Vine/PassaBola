import React, { useState, useEffect } from 'react';
import { listNews } from '../lib/newsApiClient';
import { Calendar, ExternalLink, Trophy } from 'lucide-react';
import NewsHeader from '../components/news/NewsHeader';

function HomeNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      try {
        const result = await listNews({ pageSize: 15 });
        setNews(result.items || []);
      } catch (error) {
        console.error('Erro ao carregar notícias:', error);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50">
        <NewsHeader />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  const hero = news?.length > 0 ? news[0] : null;
  const sideCalls = news?.length > 1 ? news.slice(1, 3) : [];
  const gridItems = news?.length > 3 ? news.slice(3) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-purple-50">
      <NewsHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {news.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Nenhuma notícia encontrada
            </h2>
            <p className="text-gray-500">
              Não foi possível carregar as notícias no momento.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-6 mb-8">
              {/* Hero - Destaque Principal */}
              {hero && (
                <div className="col-span-12 lg:col-span-8">
                  <a
                    href={hero.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {hero.cover && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={hero.cover}
                          alt={hero.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full">
                          <ExternalLink className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                        {hero.title}
                      </h2>
                      {hero.excerpt && (
                        <p className="text-gray-600 mb-4 line-clamp-3 text-lg leading-relaxed">
                          {hero.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="font-medium">{hero.source}</span>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(hero.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              )}

              {/* Chamadas Laterais */}
              {sideCalls.length > 0 && (
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  {sideCalls.map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      {item.cover && (
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <img
                            src={item.cover}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full">
                            <ExternalLink className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        {item.excerpt && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span className="font-medium">{item.source}</span>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(item.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Grade de Cards */}
            {gridItems.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  >
                    {item.cover && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <img
                          src={item.cover}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full">
                          <ExternalLink className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.excerpt && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {item.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-medium">{item.source}</span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(item.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </main>

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
                  <p className="text-gray-400 text-sm">Hub de Notícias</p>
                </div>
              </div>
              <p className="text-gray-400">
                Seu portal de notícias sobre futebol feminino, valorizando o talento e construindo comunidade.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Sobre o Futebol Feminino</h4>
              <p className="text-gray-400 mb-2">
                Acompanhe as principais notícias, campeonatos e conquistas do futebol feminino nacional e internacional.
              </p>
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

export default HomeNews;