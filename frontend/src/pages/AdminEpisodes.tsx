import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { VideoPreview } from '../components/VideoPreview';

export const AdminEpisodes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [seriesId, setSeriesId] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [activeSeason, setActiveSeason] = useState(1);
  const [seasons, setSeasons] = useState<number[]>([1]);

  // Form State
  const [isAdding, setIsAdding] = useState(false);
  const [newEp, setNewEp] = useState({
    episode_number: '',
    title: '',
    description: '',
    duration_minutes: '',
    video_url: '',
    thumbnail_url: ''
  });

  const fetchEpisodes = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/admin/series/${id}/episodes`);
      setSeriesId(res.data.seriesId);
      setEpisodes(res.data.episodes);
      
      const maxSeason = Math.max(1, ...res.data.episodes.map((e: any) => e.season_number));
      const s = [];
      for (let i = 1; i <= maxSeason; i++) s.push(i);
      setSeasons(s);
      
    } catch (error) {
      toast.error('Erro ao buscar episódios.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEpisodes();
  }, [id]);

  const handleDelete = async (epId: number) => {
    if (!window.confirm('Excluir este episódio?')) return;
    try {
      await api.delete(`/admin/episodes/${epId}`);
      toast.success('Episódio removido.');
      fetchEpisodes();
    } catch (error) {
      toast.error('Erro ao excluir episódio.');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/admin/series/${seriesId}/episodes`, {
        ...newEp,
        season_number: activeSeason,
        episode_number: parseInt(newEp.episode_number),
        duration_minutes: parseInt(newEp.duration_minutes) || 0
      });
      toast.success('Episódio adicionado!');
      setIsAdding(false);
      setNewEp({ episode_number: '', title: '', description: '', duration_minutes: '', video_url: '', thumbnail_url: '' });
      fetchEpisodes();
    } catch (error) {
      toast.error('Erro ao adicionar episódio.');
    }
  };

  const addSeasonTab = () => {
    const next = seasons[seasons.length - 1] + 1;
    setSeasons([...seasons, next]);
    setActiveSeason(next);
  };

  const currentEpisodes = episodes.filter(e => e.season_number === activeSeason);

  return (
    <div className="animate-fade-in text-white pb-20">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/content')} className="p-2 hover:bg-[#333] rounded-full transition">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-3xl font-bold">Gerenciar Episódios</h2>
      </div>

      {loading ? (
        <div className="text-gray-400">Carregando episódios...</div>
      ) : (
        <>
          {/* Tabs Temporadas */}
          <div className="flex items-center gap-2 mb-6 border-b border-[#333] pb-2 overflow-x-auto scrollbar-hide">
            {seasons.map(s => (
              <button 
                key={s}
                onClick={() => setActiveSeason(s)}
                className={`px-4 py-2 rounded-t font-medium whitespace-nowrap transition-colors ${activeSeason === s ? 'text-white border-b-2 border-netflix-red' : 'text-gray-500 hover:text-gray-300'}`}
              >
                Temporada {s}
              </button>
            ))}
            <button 
              onClick={addSeasonTab}
              className="px-3 py-1 ml-4 border border-gray-600 rounded text-sm hover:bg-gray-800 transition"
            >
              + Nova Temp
            </button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Episódios da Temporada {activeSeason}</h3>
            {!isAdding && (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm font-medium transition"
              >
                <Plus size={16} /> Add Episódio
              </button>
            )}
          </div>

          {/* Form Add */}
          {isAdding && (
            <form onSubmit={handleCreate} className="bg-[#222] p-6 rounded-lg border border-[#333] mb-6 shadow-xl animate-fade-in">
              <h4 className="font-bold mb-4">Novo Episódio - Temporada {activeSeason}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Nº do Episódio *</label>
                  <input type="number" required value={newEp.episode_number} onChange={e => setNewEp({...newEp, episode_number: e.target.value})} className="w-full bg-[#111] border border-[#444] rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Título do Ep *</label>
                  <input type="text" required value={newEp.title} onChange={e => setNewEp({...newEp, title: e.target.value})} className="w-full bg-[#111] border border-[#444] rounded p-2 text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Descrição</label>
                  <textarea value={newEp.description} onChange={e => setNewEp({...newEp, description: e.target.value})} className="w-full bg-[#111] border border-[#444] rounded p-2 text-white h-20" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Duração (Min)</label>
                  <input type="number" value={newEp.duration_minutes} onChange={e => setNewEp({...newEp, duration_minutes: e.target.value})} className="w-full bg-[#111] border border-[#444] rounded p-2 text-white" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Thumbnail URL</label>
                  <input type="url" value={newEp.thumbnail_url} onChange={e => setNewEp({...newEp, thumbnail_url: e.target.value})} className="w-full bg-[#111] border border-[#444] rounded p-2 text-white" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">Vídeo URL *</label>
                  <input type="url" required value={newEp.video_url} onChange={e => setNewEp({...newEp, video_url: e.target.value})} className="w-full bg-[#111] border border-[#444] rounded p-2 text-white mb-2" />
                  <VideoPreview url={newEp.video_url} />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 rounded text-gray-400 hover:bg-[#333] transition">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-netflix-red hover:bg-red-700 rounded text-white font-medium transition">Salvar</button>
              </div>
            </form>
          )}

          {/* List */}
          <div className="bg-[#222] rounded-lg border border-[#333] overflow-hidden">
            {currentEpisodes.length === 0 ? (
              <div className="p-8 text-center text-gray-400">Nenhum episódio cadastrado nesta temporada.</div>
            ) : (
              <div className="divide-y divide-[#333]">
                {currentEpisodes.map(ep => (
                  <div key={ep.id} className="p-4 flex flex-col md:flex-row items-center gap-4 hover:bg-[#2a2a2a] transition-colors">
                    <div className="text-3xl font-black text-gray-700 w-12 text-center">{ep.episode_number}</div>
                    <img src={ep.thumbnail_url || 'https://via.placeholder.com/160x90'} alt={ep.title} className="w-32 h-20 object-cover rounded shadow" />
                    <div className="flex-1">
                      <h5 className="font-bold text-lg">{ep.title}</h5>
                      <p className="text-sm text-gray-400 line-clamp-2">{ep.description}</p>
                    </div>
                    <div className="text-sm text-gray-500 w-16 text-center">{ep.duration_minutes}m</div>
                    <button onClick={() => handleDelete(ep.id)} className="p-3 bg-[#333] hover:bg-netflix-red rounded-full text-gray-400 hover:text-white transition">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
