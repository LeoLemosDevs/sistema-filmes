import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from './AuthContext';
import toast from 'react-hot-toast';

interface FavoritesContextData {
  favorites: any[];
  addFavorite: (contentId: number) => Promise<void>;
  removeFavorite: (contentId: number) => Promise<void>;
  isFavorite: (contentId: number) => boolean;
}

export const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/client/favorites')
        .then(res => setFavorites(res.data))
        .catch(err => console.error("Erro ao carregar favoritos", err));
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const addFavorite = async (contentId: number) => {
    try {
      await api.post('/client/favorites', { content_id: contentId });
      // Atualiza lista do banco (ou otimista)
      const res = await api.get('/client/favorites');
      setFavorites(res.data);
      toast.success('Adicionado à Minha Lista');
    } catch (err) {
      toast.error('Erro ao adicionar aos favoritos');
    }
  };

  const removeFavorite = async (contentId: number) => {
    try {
      await api.delete(`/client/favorites/${contentId}`);
      setFavorites(prev => prev.filter(f => f.id !== contentId));
      toast.success('Removido da Minha Lista');
    } catch (err) {
      toast.error('Erro ao remover dos favoritos');
    }
  };

  const isFavorite = (contentId: number) => {
    return favorites.some(f => f.id === contentId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
