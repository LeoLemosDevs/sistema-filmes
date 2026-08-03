import React, { useState, useEffect, useContext } from 'react';
import { Play, Plus, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { FavoritesContext } from '../contexts/FavoritesContext';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
}

export const ContentModal: React.FC<ContentModalProps> = ({ isOpen, onClose, item }) => {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodes, setEpisodes] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && item) {
      setLoading(true);
      api.get(`/client/content/${item.id}`)
        .then(res => {
          setDetails(res.data);
          if (res.data.content_type === 'series') {
            loadEpisodes(item.id, 1);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen, item]);

  const loadEpisodes = (contentId: number, season: number) => {
    api.get(`/client/series/${contentId}/episodes?season=${season}`)
      .then(res => setEpisodes(res.data))
      .catch(console.error);
  };

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const s = parseInt(e.target.value);
    setSelectedSeason(s);
    loadEpisodes(item.id, s);
  };

  if (!isOpen || !item) return null;

  const favorite = isFavorite(item.id);
  const toggleFavorite = () => {
    if (favorite) removeFavorite(item.id);
    else addFavorite(item.id);
  };

  const handlePlay = () => {
    if (details?.content_type === 'series') {
      if (episodes.length > 0) {
        navigate(`/watch/${episodes[0].id}?type=episode`);
      } else {
        alert('Nenhum episódio encontrado.');
      }
    } else {
      navigate(`/watch/${item.id}?type=movie`);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      
      <div className="relative bg-[#181818] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl z-10 custom-scrollbar">
        {/* Banner header */}
        <div className="relative w-full aspect-video md:aspect-[21/9]">
          <img 
            src={details?.thumbnail_url || item.thumbnail_url} 
            alt={item.title} 
            className="w-full h-full object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-[#181818] rounded-full flex items-center justify-center text-white hover:bg-gray-700 z-20"
          >
            <X size={24} />
          </button>
          
          <div className="absolute bottom-10 left-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">{item.title}</h2>
            <div className="flex gap-4">
              <button 
                onClick={handlePlay}
                className="bg-white text-black px-6 py-2 rounded flex items-center font-bold hover:bg-gray-300 transition"
              >
                <Play size={20} className="mr-2" /> Assistir
              </button>
              <button 
                onClick={toggleFavorite}
                className="w-10 h-10 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition bg-black/50"
              >
                {favorite ? <Check size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
              </button>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-10 text-white flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex gap-4 text-gray-400 text-sm mb-4">
              <span>{details?.release_year}</span>
              <span className="border border-gray-500 px-1 rounded text-xs">HD</span>
            </div>
            <p className="text-lg leading-relaxed">{details?.description || 'Nenhuma descrição fornecida.'}</p>
          </div>
          <div className="md:w-1/3 flex flex-col gap-4 text-sm">
            {details?.genres && details.genres.length > 0 && (
              <div>
                <span className="text-gray-500">Gêneros: </span>
                <span>{details.genres.join(', ')}</span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Tipo: </span>
              <span>{details?.content_type === 'series' ? 'Série' : 'Filme'}</span>
            </div>
          </div>
        </div>

        {/* Series Episodes Section */}
        {details?.content_type === 'series' && (
          <div className="px-10 pb-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">Episódios</h3>
              <select 
                value={selectedSeason}
                onChange={handleSeasonChange}
                className="bg-[#242424] text-white border border-gray-600 rounded px-4 py-2 outline-none focus:border-white"
              >
                {Array.from({ length: details.total_seasons || 1 }, (_, i) => i + 1).map(s => (
                  <option key={s} value={s}>Temporada {s}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-4">
              {episodes.map((ep, idx) => (
                <div 
                  key={ep.id} 
                  className="flex flex-col md:flex-row items-center gap-4 p-4 border-b border-[#333] hover:bg-[#2a2a2a] rounded transition cursor-pointer"
                  onClick={() => navigate(`/watch/${ep.id}?type=episode`)}
                >
                  <div className="text-gray-400 text-xl font-bold w-8 text-center">{idx + 1}</div>
                  <div className="relative w-32 md:w-40 aspect-video shrink-0 group">
                    <img src={ep.thumbnail_url || item.thumbnail_url} alt={ep.title} className="w-full h-full object-cover rounded" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Play size={24} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold mb-2">{ep.title}</h4>
                    <p className="text-gray-400 text-sm line-clamp-2">{ep.description}</p>
                  </div>
                  {ep.duration_minutes && (
                    <div className="text-gray-500 text-sm">{ep.duration_minutes}m</div>
                  )}
                </div>
              ))}
              {episodes.length === 0 && !loading && (
                <p className="text-gray-500">Nenhum episódio cadastrado nesta temporada.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
