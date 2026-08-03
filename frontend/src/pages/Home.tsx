import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { UserHeader } from '../components/UserHeader';
import { ContentRow } from '../components/ContentRow';
import { ContentModal } from '../components/ContentModal';
import { Play, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Home = () => {
  const [contents, setContents] = useState<any[]>([]);
  const [heroMovie, setHeroMovie] = useState<any>(null);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const filteredContents = React.useMemo(() => {
    if (location.pathname === '/series') return contents.filter(c => c.content_type === 'series');
    if (location.pathname === '/movies') return contents.filter(c => c.content_type === 'movie');
    return contents;
  }, [contents, location.pathname]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('/client/content');
        setContents(response.data);
      } catch (error) {
        console.error('Erro ao buscar conteúdos', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    if (filteredContents.length > 0) {
      const featured = filteredContents.find(c => c.is_featured === 1 || c.is_featured === true);
      setHeroMovie(featured || filteredContents[0]);
    } else {
      setHeroMovie(null);
    }
  }, [filteredContents]);

  if (loading) {
    return <div className="min-h-screen bg-[#141414] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-[#141414] overflow-x-hidden pb-12 font-sans selection:bg-netflix-red selection:text-white">
      <UserHeader />

      {/* Hero Banner */}
      {heroMovie && (
        <div className="relative h-[70vh] sm:h-[90vh] w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent z-10"></div>
          
          <img 
            src={heroMovie.featured_image_url || heroMovie.thumbnail_url || 'https://via.placeholder.com/1920x1080'} 
            alt={heroMovie.title}
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          <div className="absolute bottom-[20%] left-4 md:left-12 z-20 w-full max-w-2xl">
            <h1 className="text-4xl sm:text-7xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
              {heroMovie.title}
            </h1>
            <p className="text-white text-lg sm:text-xl text-shadow-md mb-8 line-clamp-3 font-medium">
              {heroMovie.description || 'Assista a este incrível sucesso diretamente na nossa plataforma. Disponível agora.'}
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={() => navigate(`/watch/${heroMovie.id}`)}
                className="flex items-center justify-center gap-2 bg-white text-black px-6 py-2 md:px-8 md:py-3 rounded shadow-lg hover:bg-white/80 transition-colors font-bold text-lg md:text-xl"
              >
                <Play fill="black" size={24} /> Assistir
              </button>
              <button 
                onClick={() => setSelectedMovie(heroMovie)}
                className="flex items-center justify-center gap-2 bg-[#6d6d6eb3] text-white px-6 py-2 md:px-8 md:py-3 rounded shadow-lg hover:bg-[#6d6d6e66] transition-colors font-bold text-lg md:text-xl"
              >
                <Info size={24} /> Mais Informações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trilhas (Rows) de Conteúdo */}
      <div className="relative z-20 -mt-24 sm:-mt-32">
        <ContentRow 
          title={location.pathname === '/trending' ? 'Bombando Agora' : 'Lançamentos'} 
          items={filteredContents.slice(0, 10)} 
          onOpenDetails={setSelectedMovie} 
        />
        <ContentRow 
          title="Em Alta na Filmes Stream" 
          items={location.pathname === '/trending' ? filteredContents : filteredContents.slice().reverse()} 
          onOpenDetails={setSelectedMovie} 
        />
        <ContentRow 
          title="Assistir Novamente" 
          items={filteredContents} 
          onOpenDetails={setSelectedMovie} 
        />
      </div>

      <ContentModal 
        item={selectedMovie} 
        isOpen={!!selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />
    </div>
  );
};
