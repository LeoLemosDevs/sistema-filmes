import React, { useContext, useState } from 'react';
import { UserHeader } from '../components/UserHeader';
import { FavoritesContext } from '../contexts/FavoritesContext';
import { ContentCard } from '../components/ContentCard';
import { ContentModal } from '../components/ContentModal';

export const MyList = () => {
  const { favorites } = useContext(FavoritesContext);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#141414]">
      <UserHeader />
      
      <div className="pt-24 px-4 md:px-12 pb-12">
        <h2 className="text-3xl text-white font-bold mb-8">Minha Lista</h2>

        {favorites.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Você ainda não adicionou nenhum título à sua lista.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-12">
            {favorites.map((item) => (
              <ContentCard key={item.id} item={item} onOpenDetails={setSelectedMovie} />
            ))}
          </div>
        )}
      </div>

      <ContentModal 
        item={selectedMovie} 
        isOpen={!!selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />
    </div>
  );
};
