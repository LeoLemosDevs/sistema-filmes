import React, { useContext } from 'react';
import { Play, Info, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FavoritesContext } from '../contexts/FavoritesContext';

interface ContentCardProps {
  item: any;
  onOpenDetails: (item: any) => void;
}

export const ContentCard: React.FC<ContentCardProps> = ({ item, onOpenDetails }) => {
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useContext(FavoritesContext);
  
  const favorite = isFavorite(item.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item.id);
    }
  };

  return (
    <div className="relative w-full aspect-[2/3] transition-transform duration-300 hover:scale-[1.10] hover:z-50 cursor-pointer origin-center group/card rounded-md overflow-hidden bg-[#222] shadow-lg">
      <img 
        src={item.thumbnail_url || 'https://via.placeholder.com/300x450'} 
        alt={item.title} 
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2 sm:p-4">
        <div className="absolute top-2 right-2 bg-red-600/80 px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm shadow-md">
          {item.content_type === 'series' ? 'Série' : 'Filme'}
        </div>
        <h3 className="text-white font-bold text-xs sm:text-sm md:text-base truncate drop-shadow-md mb-2">{item.title}</h3>
        <div className="flex items-center gap-2">
          {/* Assistir */}
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              if (item.content_type === 'series') {
                onOpenDetails(item); // Séries abrem modal primeiro
              } else {
                navigate(`/watch/${item.id}`); 
              }
            }}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-300 transition-colors shadow-lg"
          >
            <Play size={14} className="text-black ml-0.5" />
          </button>
          
          {/* Favorito */}
          <button 
            onClick={toggleFavorite}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors shadow-lg bg-black/50"
          >
            {favorite ? <Check size={14} className="text-white" /> : <Plus size={14} className="text-white" />}
          </button>

          {/* Mais Informações */}
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenDetails(item); }}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white transition-colors shadow-lg bg-black/50 ml-auto"
          >
            <Info size={14} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
