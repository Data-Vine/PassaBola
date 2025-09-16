import React, { useState, useEffect } from 'react';
import { Camera, Filter, Search, X, Heart, Share, Download, Calendar, MapPin } from 'lucide-react';
import ErrorBanner from './ui/ErrorBanner.jsx';

const API = 'http://localhost:5001/api';

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [likedPhotos, setLikedPhotos] = useState(new Set());
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/gallery`);
        
        if (!response.ok) {
          let body = {};
          try { body = await response.json(); } catch {}
          throw new Error(body.error || response.statusText || 'Falha na solicitação');
        }
        
        const data = await response.json();
        
        // Mock additional data for demo (in real app, this would come from API)
        const mockPhotos = [
          { id: 1, url: 'https://picsum.photos/400/400?random=1', caption: 'Gol da Vitória', date: '2024-03-15', location: 'Campo da Vila', category: 'matches', likes: 45, description: 'Momento emocionante do gol que definiu a partida' },
          { id: 2, url: 'https://picsum.photos/400/400?random=2', caption: 'Comemoração das Jogadoras', date: '2024-03-15', location: 'Campo da Vila', category: 'celebrations', likes: 32, description: 'Alegria das atletas após a vitória' },
          { id: 3, url: 'https://picsum.photos/400/400?random=3', caption: 'Time Leoas da Vila', date: '2024-03-10', location: 'Campo da Vila', category: 'teams', likes: 28, description: 'Foto oficial do time antes da partida' },
          { id: 4, url: 'https://picsum.photos/400/400?random=4', caption: 'Bastidores', date: '2024-03-15', location: 'Vestiário', category: 'backstage', likes: 15, description: 'Momento de preparação antes do jogo' },
          ...data
        ];
        
        const filteredPhotos = selectedCategory === 'all' 
          ? mockPhotos 
          : mockPhotos.filter(photo => photo.category === selectedCategory);
        
        setPhotos(filteredPhotos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [selectedCategory]);

  const categories = [
    { id: 'all', name: 'Todas', count: 48 },
    { id: 'matches', name: 'Jogos', count: 24 },
    { id: 'celebrations', name: 'Comemorações', count: 12 },
    { id: 'teams', name: 'Times', count: 8 },
    { id: 'backstage', name: 'Bastidores', count: 4 }
  ];

  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = (photo.title?.toLowerCase() || photo.caption?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (photo.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const toggleLike = (photoId) => {
    setLikedPhotos(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(photoId)) {
        newLiked.delete(photoId);
      } else {
        newLiked.add(photoId);
      }
      return newLiked;
    });
  };

  const openModal = (photo) => {
    setSelectedPhoto(photo);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="bg-gradient-to-r from-green-500 to-purple-500 p-3 rounded-full">
            <Camera className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Galeria de Fotos</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Reviva os melhores momentos da Copa PassaBola através das nossas fotos oficiais
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar fotos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>{category.name}</span>
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorBanner message={error} />}

      {/* Photo Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando galeria...</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPhotos.map(photo => (
          <div
            key={photo.id}
            className="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            onClick={() => openModal(photo)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={photo.url}
                alt={photo.title || photo.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="font-bold text-lg mb-1 line-clamp-2">{photo.title || photo.caption || 'Sem título'}</h3>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{photo.date || 'Data não informada'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{photo.likes}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Like Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLike(photo.id);
              }}
              className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                likedPhotos.has(photo.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart
                className={`h-5 w-5 ${likedPhotos.has(photo.id) ? 'fill-current' : ''}`}
              />
            </button>

            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {categories.find(c => c.id === photo.category)?.name}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* No Results */}
      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Nenhuma foto encontrada</h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou termo de busca para encontrar o que procura.
          </p>
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full max-h-full overflow-hidden rounded-xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title || selectedPhoto.caption}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {selectedPhoto.title || selectedPhoto.caption || 'Sem título'}
                    </h2>
                    <p className="text-gray-600 mb-4">{selectedPhoto.description || 'Sem descrição'}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{selectedPhoto.date || 'Data não informada'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedPhoto.location || 'Local não informado'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{selectedPhoto.likes} curtidas</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => toggleLike(selectedPhoto.id)}
                      className={`p-3 rounded-full transition-all duration-200 ${
                        likedPhotos.has(selectedPhoto.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${likedPhotos.has(selectedPhoto.id) ? 'fill-current' : ''}`}
                      />
                    </button>
                    <button className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-green-50 hover:text-green-600 transition-colors">
                      <Share className="h-5 w-5" />
                    </button>
                    <button className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;