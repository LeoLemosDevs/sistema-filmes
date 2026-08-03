import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/api';
import { UserHeader } from '../components/UserHeader';
import { ContentCard } from '../components/ContentCard';
import { MovieDetailsModal } from '../components/MovieDetailsModal';

export const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const response = await api.get(`/client/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (error) {
        console.error('Erro na busca', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#141414]">
      <UserHeader />
      
      <div className="pt-24 px-4 md:px-12 pb-12">
        <h2 className="text-2xl text-gray-400 mb-8">
          Resultados da busca por: <span className="text-white font-bold">"{query}"</span>
        </h2>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-netflix-red border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">Sua busca não encontrou nenhum resultado correspondente.</p>
            <p className="mt-2">Sugestões: tente palavras diferentes ou mais genéricas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-2 gap-y-12">
            {results.map((item) => (
              <ContentCard key={item.id} item={item} onOpenDetails={setSelectedMovie} />
            ))}
          </div>
        )}
      </div>

      <MovieDetailsModal 
        content={selectedMovie} 
        isOpen={!!selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
      />
    </div>
  );
};
