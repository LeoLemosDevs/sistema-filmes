import React, { useState, useEffect } from 'react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';
import { VideoPreview } from './VideoPreview';

interface AdminContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  onSuccess: () => void;
}

export const AdminContentModal: React.FC<AdminContentModalProps> = ({ isOpen, onClose, content, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    release_year: new Date().getFullYear(),
    content_type: 'movie',
    thumbnail_url: '',
    video_url: '',
    is_featured: false,
    featured_image_url: '',
    genre_ids: [] as number[]
  });
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState<any[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await api.get('/client/genres');
        setGenres(res.data || []);
      } catch (err) {
        console.error('Erro ao buscar gêneros:', err);
      }
    };
    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (content) {
        let initialGenreIds: number[] = [];
        if (content.genre_ids) {
          initialGenreIds = typeof content.genre_ids === 'string'
            ? content.genre_ids.split(',').map((id: string) => Number(id.trim())).filter(Boolean)
            : Array.isArray(content.genre_ids) ? content.genre_ids : [];
        }
        setFormData({
          title: content.title || '',
          description: content.description || '',
          release_year: content.release_year || new Date().getFullYear(),
          content_type: content.content_type || 'movie',
          thumbnail_url: content.thumbnail_url || '',
          video_url: content.video_url || '',
          is_featured: content.is_featured === 1 || content.is_featured === true,
          featured_image_url: content.featured_image_url || '',
          genre_ids: initialGenreIds
        });
      } else {
        setFormData({
          title: '',
          description: '',
          release_year: new Date().getFullYear(),
          content_type: 'movie',
          thumbnail_url: '',
          video_url: '',
          is_featured: false,
          featured_image_url: '',
          genre_ids: []
        });
      }
    }
  }, [isOpen, content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const toggleGenre = (id: number) => {
    setFormData(prev => {
      const exists = prev.genre_ids.includes(id);
      const nextIds = exists ? prev.genre_ids.filter(g => g !== id) : [...prev.genre_ids, id];
      return { ...prev, genre_ids: nextIds };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (content) {
        await api.put(`/admin/content/${content.id}`, formData);
        toast.success('Conteúdo atualizado com sucesso!');
      } else {
        await api.post('/admin/content', formData);
        toast.success('Conteúdo criado com sucesso!');
      }
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Erro ao salvar conteúdo.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-[#181818] rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[#333]">
        <div className="flex justify-between items-center p-6 border-b border-[#333]">
          <h2 className="text-2xl font-bold text-white">{content ? 'Editar Conteúdo' : 'Novo Conteúdo'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Título</label>
            <input 
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-[#333] text-white border border-[#444] rounded px-4 py-2 outline-none focus:border-white transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Descrição</label>
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#333] text-white border border-[#444] rounded px-4 py-2 outline-none focus:border-white transition-colors h-24"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Ano de Lançamento</label>
              <input 
                type="number"
                name="release_year"
                value={formData.release_year}
                onChange={handleChange}
                className="w-full bg-[#333] text-white border border-[#444] rounded px-4 py-2 outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Tipo</label>
              <select 
                name="content_type"
                value={formData.content_type}
                onChange={handleChange}
                className="w-full bg-[#333] text-white border border-[#444] rounded px-4 py-2 outline-none focus:border-white transition-colors"
              >
                <option value="movie">Filme</option>
                <option value="series">Série</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Categorias / Gêneros</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-44 overflow-y-auto bg-[#222] p-3 rounded border border-[#444]">
              {genres.map((g: any) => {
                const checked = formData.genre_ids.includes(g.id);
                return (
                  <label key={g.id} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white select-none">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleGenre(g.id)}
                      className="accent-netflix-red w-4 h-4"
                    />
                    {g.name}
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">URL da Thumbnail (Capa Retrato/Poster)</label>
            <input 
              name="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="w-full bg-[#333] text-white border border-[#444] rounded px-4 py-2 outline-none focus:border-white transition-colors"
              placeholder="Ex: https://..."
            />
          </div>

          <div className="flex items-center gap-3 bg-[#222] p-4 rounded border border-[#444]">
            <input 
              type="checkbox"
              id="is_featured"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-5 h-5 accent-netflix-red"
            />
            <label htmlFor="is_featured" className="text-white font-medium cursor-pointer">
              Destacar na Página Inicial
            </label>
          </div>

          {formData.is_featured && (
            <div className="animate-fade-in bg-[#2a2a2a] p-4 rounded border border-[#444]">
              <label className="block text-sm font-medium text-netflix-red mb-1">URL da Imagem de Destaque (Banner 16:9)</label>
              <input 
                name="featured_image_url"
                value={formData.featured_image_url}
                onChange={handleChange}
                className="w-full bg-[#111] text-white border border-[#555] rounded px-4 py-2 outline-none focus:border-netflix-red transition-colors"
                placeholder="Uma imagem larga para o topo do site"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">URL do Vídeo</label>
            <input 
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              className="w-full bg-[#333] text-white border border-[#444] rounded px-4 py-2 outline-none focus:border-white transition-colors mb-2"
              placeholder="Ex: https://www.youtube.com/watch?v=... ou C:/Filmes/Batman.mp4"
            />
            {/* Live Preview of the Video URL */}
            <VideoPreview url={formData.video_url} />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-[#333]">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded text-white hover:bg-[#333] transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded bg-netflix-red text-white hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
