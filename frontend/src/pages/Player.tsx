import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, List, X, PlayCircle } from 'lucide-react';
import api from '../api/api';

export const Player = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const type = queryParams.get('type') || 'movie';

  // State for Series Drawer
  const [seriesData, setSeriesData] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeSeason, setActiveSeason] = useState(1);
  const [currentEpisodeId, setCurrentEpisodeId] = useState<number | null>(null);

  useEffect(() => {
    const fetchVideoAndContext = async () => {
      try {
        setLoading(true);
        // 1. Fetch Video URL
        const response = await api.get(`/client/video-url/${id}?type=${type}`);
        let finalUrl = response.data.url;
        
        if (finalUrl && !finalUrl.startsWith('http')) {
          finalUrl = `${api.defaults.baseURL}/client/stream?path=${encodeURIComponent(finalUrl)}`;
        }
        setVideoUrl(finalUrl);

        // 2. If it's an episode, fetch the Series Context
        if (type === 'episode') {
          setCurrentEpisodeId(parseInt(id as string));
          const contextRes = await api.get(`/client/episode/${id}/context`);
          const seriesId = contextRes.data.content_id;
          
          const seriesRes = await api.get(`/client/content/${seriesId}`);
          setSeriesData(seriesRes.data);

          // Find which season this episode belongs to and set as active
          if (seriesRes.data && seriesRes.data.episodes) {
            const currentEp = seriesRes.data.episodes.find((ep: any) => ep.id === parseInt(id as string));
            if (currentEp) {
              setActiveSeason(currentEp.season_number);
            }
          }
        } else {
          setSeriesData(null);
        }

      } catch (error) {
        console.error('Erro ao buscar o vídeo ou contexto', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoAndContext();
  }, [id, type]);

  if (loading) {
    return <div className="h-screen w-screen bg-black flex items-center justify-center text-white">Carregando player...</div>;
  }

  const handlePlayEpisode = (epId: number) => {
    setIsDrawerOpen(false);
    navigate(`/watch/${epId}?type=episode`);
  };

  const getSeasonsArray = () => {
    if (!seriesData || !seriesData.episodes) return [];
    const maxSeason = Math.max(...seriesData.episodes.map((e: any) => e.season_number));
    return Array.from({ length: maxSeason }, (_, i) => i + 1);
  };

  return (
    <div className="h-screen w-screen bg-black relative flex items-center justify-center group overflow-hidden font-sans">
      {/* Top Controls (Aparecem ao passar o mouse) */}
      <div className="absolute top-0 left-0 right-0 p-8 z-40 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => navigate(-1)}
          className="text-white p-3 bg-black/40 hover:bg-white/20 rounded-full transition-colors shadow-lg"
        >
          <ArrowLeft size={36} />
        </button>

        {type === 'episode' && seriesData && (
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 text-white px-4 py-3 bg-black/60 hover:bg-white/20 rounded font-medium transition-colors shadow-lg"
          >
            <List size={24} />
            <span>Episódios</span>
          </button>
        )}
      </div>

      {/* Renderização do Vídeo */}
      {videoUrl ? (
        (videoUrl.includes('youtube.com/watch') || videoUrl.includes('youtu.be/')) ? (() => {
          let ytId = '';
          if (videoUrl.includes('youtube.com/watch')) {
            const urlObj = new URL(videoUrl);
            ytId = urlObj.searchParams.get('v') || '';
          } else if (videoUrl.includes('youtu.be/')) {
            ytId = videoUrl.split('youtu.be/')[1].split('?')[0];
          }
          return (
            <iframe 
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1&rel=0&showinfo=0`} 
              className="w-full h-full border-none"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          );
        })() : videoUrl.includes('drive.google.com') ? (() => {
          const match = videoUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || videoUrl.match(/id=([a-zA-Z0-9_-]+)/);
          const driveId = match ? match[1] : '';
          return (
            <iframe 
              src={`https://drive.google.com/file/d/${driveId}/preview`} 
              className="w-full h-full border-none"
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
          );
        })() : (
          <video 
            src={videoUrl} 
            controls 
            autoPlay 
            className="w-full h-full object-contain outline-none bg-black"
          />
        )
      ) : (
        <div className="text-center animate-fade-in p-8">
          <h2 className="text-white text-3xl mb-4 font-bold">Vídeo Indisponível</h2>
          <p className="text-gray-400 mb-12">Nenhum link de vídeo foi cadastrado para este conteúdo.</p>
          
          <div className="border border-[#333] bg-[#111] p-16 rounded-xl inline-block shadow-2xl">
            <p className="text-gray-500 mb-2 uppercase text-sm font-bold tracking-widest">Simulação de Tela Cheia</p>
            <h3 className="text-netflix-red text-4xl font-black uppercase drop-shadow-lg">Conteúdo</h3>
            <p className="text-gray-400 mt-4 text-lg">Se houvesse um vídeo, ele estaria tocando aqui.</p>
          </div>
        </div>
      )}

      {/* Gaveta de Episódios (Overlay) */}
      {isDrawerOpen && seriesData && (
        <>
          <div 
            className="absolute inset-0 bg-black/60 z-40 animate-fade-in" 
            onClick={() => setIsDrawerOpen(false)}
          ></div>
          <div className="absolute top-0 right-0 bottom-0 w-full sm:w-[450px] bg-[#181818] z-50 flex flex-col shadow-2xl animate-slide-in">
            <div className="p-6 flex justify-between items-center border-b border-[#333]">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{seriesData.title}</h3>
                <p className="text-gray-400 text-sm">Lista de Episódios</p>
              </div>
              <button onClick={() => setIsDrawerOpen(false)} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#333] transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Temporadas Select */}
            <div className="px-6 py-4 border-b border-[#333]">
              <select 
                value={activeSeason}
                onChange={(e) => setActiveSeason(parseInt(e.target.value))}
                className="w-full bg-[#333] text-white border border-[#444] rounded px-4 py-3 font-medium outline-none focus:border-white transition-colors appearance-none"
              >
                {getSeasonsArray().map(s => (
                  <option key={s} value={s}>Temporada {s}</option>
                ))}
              </select>
            </div>

            {/* Lista de Episódios */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
              {seriesData.episodes
                .filter((ep: any) => ep.season_number === activeSeason)
                .map((ep: any) => {
                  const isCurrent = ep.id === currentEpisodeId;
                  return (
                    <div 
                      key={ep.id}
                      onClick={() => !isCurrent && handlePlayEpisode(ep.id)}
                      className={`flex gap-4 p-4 rounded-lg mb-2 cursor-pointer transition-colors group ${
                        isCurrent ? 'bg-[#333] border border-gray-600' : 'hover:bg-[#2a2a2a] border border-transparent'
                      }`}
                    >
                      <div className="w-32 h-20 flex-shrink-0 relative rounded overflow-hidden">
                        <img 
                          src={ep.thumbnail_url || 'https://via.placeholder.com/160x90'} 
                          alt={ep.title} 
                          className="w-full h-full object-cover"
                        />
                        {!isCurrent && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <PlayCircle size={28} className="text-white" />
                          </div>
                        )}
                        {isCurrent && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-netflix-red font-bold text-sm tracking-wider uppercase">
                            Tocando
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold truncate ${isCurrent ? 'text-white' : 'text-gray-200 group-hover:text-white'}`}>
                          {ep.episode_number}. {ep.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ep.description}</p>
                        {ep.duration_minutes > 0 && (
                          <p className="text-xs text-gray-400 mt-2 font-medium">{ep.duration_minutes} min</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
