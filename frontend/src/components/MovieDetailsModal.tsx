import React, { useState, useEffect } from 'react';
import { Play, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MovieDetailsModalProps {
  content: any;
  isOpen: boolean;
  onClose: () => void;
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ content, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasons, setSeasons] = useState<number[]>([]);

  useEffect(() => {
    if (content?.content_type === 'series' && content.episodes) {
      const uniqueSeasons = Array.from(new Set(content.episodes.map((e: any) => e.season_number))) as number[];
      setSeasons(uniqueSeasons.sort());
      if (uniqueSeasons.length > 0) setSelectedSeason(uniqueSeasons[0]);
    }
  }, [content]);

  if (!isOpen || !content) return null;

  const isSeries = content.content_type === 'series';
  const currentEpisodes = isSeries && content.episodes ? content.episodes.filter((e: any) => e.season_number === selectedSeason) : [];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm">
      <div className="relative bg-[#181818] rounded-xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden animate-fade-in border border-[#333]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black transition-colors"
        >
          <X size={24} />
        </button>

        <div className="relative h-72 sm:h-[450px] w-full">
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/40 to-transparent z-10"></div>
          <img 
            src={content.thumbnail_url || 'https://via.placeholder.com/1200x600'} 
            alt={content.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-8 left-10 z-20">
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 drop-shadow-xl">{content.title}</h2>
            {!isSeries && (
              <button 
                onClick={() => { onClose(); navigate(`/watch/${content.id}`); }}
                className="flex items-center gap-3 bg-white text-black px-6 py-2 sm:px-10 sm:py-3 rounded text-lg font-bold hover:bg-gray-200 transition-colors shadow-2xl"
              >
                <Play fill="black" size={24} /> Assistir
              </button>
            )}
          </div>
        </div>

        <div className="px-10 pb-6 pt-4 text-white grid grid-cols-1 sm:grid-cols-3 gap-12">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-4 mb-6 text-sm font-medium">
              <span className="text-green-500 font-bold text-base">Relevante</span>
              <span className="text-gray-300 text-base">{content.release_year}</span>
              <span className="border border-gray-600 px-2 py-0.5 rounded text-gray-300 uppercase text-xs tracking-wider bg-black/30">
                {content.content_type}
              </span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed font-light">
              {content.description || 'Nenhuma descrição disponível para este conteúdo.'}
            </p>
          </div>
          <div>
            <div className="mb-4">
              <span className="text-gray-500 block mb-1 text-sm">Elenco:</span>
              <span className="text-gray-300 text-sm hover:underline cursor-pointer">Carregamento Dinâmico (Em breve)</span>
            </div>
          </div>
        </div>

        {/* Seção de Episódios se for Série */}
        {isSeries && (
          <div className="px-10 pb-10">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h3 className="text-2xl text-white font-bold">Episódios</h3>
              {seasons.length > 0 && (
                <select 
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(Number(e.target.value))}
                  className="bg-[#242424] text-white border border-gray-700 p-2 rounded outline-none focus:border-white transition-colors"
                >
                  {seasons.map(season => (
                    <option key={season} value={season}>Temporada {season}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex flex-col gap-4">
              {currentEpisodes.length === 0 ? (
                <p className="text-gray-500">Nenhum episódio cadastrado para esta série ainda.</p>
              ) : (
                currentEpisodes.map((ep: any) => (
                  <div key={ep.id} className="flex gap-4 p-4 border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors rounded group cursor-pointer"
                       onClick={() => { onClose(); navigate(`/watch/${ep.id}`); }}>
                    <div className="text-2xl text-gray-500 font-bold w-8 flex items-center justify-center group-hover:text-white transition-colors">
                      {ep.episode_number}
                    </div>
                    <div className="w-32 h-20 flex-none relative rounded overflow-hidden shadow-lg">
                      <img src={ep.thumbnail_url || content.thumbnail_url} alt={ep.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent flex items-center justify-center transition-colors">
                        <Play size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="text-white font-bold">{ep.title}</h4>
                      </div>
                      <p className="text-sm text-gray-400 line-clamp-2">{ep.description}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
