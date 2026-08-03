import React, { useEffect, useState, useContext } from 'react';
import api from '../api/api';
import { AuthContext } from '../contexts/AuthContext';
import { Film, Play, UserCheck } from 'lucide-react';

export const AdminDashboard = () => {
  const [contentCount, setContentCount] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/content');
        setContentCount(response.data.length);
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-2">Visão Geral</h2>
      <p className="text-gray-400 mb-8">Bem-vindo de volta ao painel de controle, {user?.name}.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-[#222] border border-[#333] p-6 rounded-lg shadow-lg hover:border-netflix-red transition-all duration-300 flex items-center justify-between group">
          <div>
            <h3 className="text-gray-400 font-medium mb-1">Total de Títulos</h3>
            <p className="text-4xl font-bold text-white">{contentCount}</p>
          </div>
          <div className="bg-[#333] p-4 rounded-full group-hover:bg-netflix-red/20 group-hover:text-netflix-red transition-colors">
            <Film size={28} />
          </div>
        </div>
        
        <div className="bg-[#222] border border-[#333] p-6 rounded-lg shadow-lg hover:border-netflix-red transition-all duration-300 flex items-center justify-between group">
          <div>
            <h3 className="text-gray-400 font-medium mb-1">Séries Cadastradas</h3>
            <p className="text-4xl font-bold text-white">0</p>
          </div>
          <div className="bg-[#333] p-4 rounded-full group-hover:bg-netflix-red/20 group-hover:text-netflix-red transition-colors">
            <Play size={28} />
          </div>
        </div>
        
        <div className="bg-[#222] border border-[#333] p-6 rounded-lg shadow-lg hover:border-netflix-red transition-all duration-300 flex items-center justify-between group">
          <div>
            <h3 className="text-gray-400 font-medium mb-1">Usuários Ativos</h3>
            <p className="text-4xl font-bold text-white">0</p>
          </div>
          <div className="bg-[#333] p-4 rounded-full group-hover:bg-netflix-red/20 group-hover:text-netflix-red transition-colors">
            <UserCheck size={28} />
          </div>
        </div>

      </div>
    </div>
  );
};
