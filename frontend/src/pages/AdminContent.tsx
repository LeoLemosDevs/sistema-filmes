import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Pencil, Trash2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { AdminContentModal } from '../components/AdminContentModal';
import { ConfirmModal } from '../components/ConfirmModal';

export const AdminContent = () => {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<any>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/content');
      setContents(response.data);
    } catch (error) {
      toast.error('Erro ao carregar os conteúdos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleOpenCreate = () => {
    setEditingContent(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (content: any) => {
    setEditingContent(content);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeletingId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/content/${deletingId}`);
      toast.success('Conteúdo excluído com sucesso!');
      fetchContents();
    } catch (error) {
      toast.error('Erro ao excluir o conteúdo.');
    } finally {
      setIsConfirmOpen(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-white">Gerenciar Conteúdo</h2>
        <button 
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-netflix-red hover:bg-red-700 text-white px-4 py-2 rounded transition-colors font-medium shadow"
        >
          <Plus size={20} />
          Adicionar Novo
        </button>
      </div>

      <div className="bg-[#222] border border-[#333] rounded-lg overflow-hidden shadow-lg">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Carregando catálogo...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#1a1a1a] border-b border-[#333] text-gray-400 text-sm uppercase">
                  <th className="p-4 font-medium w-24">Capa</th>
                  <th className="p-4 font-medium">Título</th>
                  <th className="p-4 font-medium">Tipo</th>
                  <th className="p-4 font-medium">Ano</th>
                  <th className="p-4 font-medium text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {contents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">Nenhum conteúdo cadastrado na base.</td>
                  </tr>
                ) : (
                  contents.map(item => (
                    <tr key={item.id} className="hover:bg-[#2a2a2a] transition-colors">
                      <td className="p-4">
                        <img 
                          src={item.thumbnail_url || 'https://via.placeholder.com/80x120'} 
                          alt={item.title} 
                          className="w-12 h-16 sm:w-16 sm:h-24 object-cover rounded shadow"
                        />
                      </td>
                      <td className="p-4 font-medium text-white">{item.title}</td>
                      <td className="p-4 text-gray-300">
                        <span className="bg-[#333] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                          {item.content_type}
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{item.release_year}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                          {item.content_type === 'series' && (
                            <button 
                              onClick={() => window.location.href = `/admin/series/${item.id}/episodes`} 
                              className="p-2 bg-[#333] hover:bg-green-600 rounded text-green-400 hover:text-white transition-colors"
                              title="Gerenciar Episódios"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </button>
                          )}
                          <button 
                            onClick={() => handleOpenEdit(item)} 
                            className="p-2 bg-[#333] hover:bg-blue-600 rounded text-blue-400 hover:text-white transition-colors"
                            title="Editar"
                          >
                            <Pencil size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(item.id)} 
                            className="p-2 bg-[#333] hover:bg-netflix-red rounded text-netflix-red hover:text-white transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AdminContentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        content={editingContent}
        onSuccess={fetchContents}
      />

      <ConfirmModal 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Tem certeza que deseja excluir este conteúdo da plataforma? Esta ação não pode ser desfeita e os usuários perderão o acesso ao vídeo."
      />
    </div>
  );
};
