import React, { useState } from 'react';
import { Database, FolderSearch, Download, HardDrive } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/api';

export const AdminTools = () => {
  const [folderPath, setFolderPath] = useState('');
  const [scanning, setScanning] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  const handleBackup = async () => {
    setBackingUp(true);
    toast.loading('Gerando backup...', { id: 'backup' });
    
    try {
      // Usamos fetch nativo para poder baixar o arquivo Blob
      const response = await fetch('http://localhost:5000/api/admin/backup', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Falha ao gerar backup');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Extrair nome do arquivo do header se possível, ou usar default
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = 'backup.sql';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
      }
      
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Backup concluído com sucesso!', { id: 'backup' });
    } catch (error) {
      console.error(error);
      toast.error('Erro ao realizar backup. O mysqldump está instalado?', { id: 'backup' });
    } finally {
      setBackingUp(false);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderPath) return;

    setScanning(true);
    toast.loading('Escaneando pasta...', { id: 'scan' });

    try {
      const response = await api.post('/admin/scan-directory', { folderPath });
      toast.success(response.data.message, { id: 'scan' });
      setFolderPath('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao escanear a pasta.', { id: 'scan' });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="animate-fade-in text-white max-w-4xl">
      <h2 className="text-3xl font-bold mb-2">Ferramentas do Sistema</h2>
      <p className="text-gray-400 mb-8">Utilitários para gerenciamento em massa e segurança de dados.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card de Backup */}
        <div className="bg-[#222] border border-[#333] rounded-lg p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/20 text-blue-500 rounded-lg">
              <Database size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Backup do Banco</h3>
              <p className="text-sm text-gray-400">Exporte todos os dados (SQL)</p>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-6 flex-1">
            Gera um arquivo <code>.sql</code> contendo toda a estrutura do banco de dados, filmes, séries e usuários cadastrados. Recomendado fazer semanalmente.
          </p>

          <button 
            onClick={handleBackup}
            disabled={backingUp}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-3 px-4 rounded font-medium transition"
          >
            <Download size={20} />
            {backingUp ? 'Processando...' : 'Fazer Download do Backup'}
          </button>
        </div>

        {/* Card de Importação em Massa */}
        <div className="bg-[#222] border border-[#333] rounded-lg p-6 shadow-xl flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-netflix-red/20 text-netflix-red rounded-lg">
              <FolderSearch size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Scanner de Pasta Local</h3>
              <p className="text-sm text-gray-400">Importação automática em massa</p>
            </div>
          </div>
          
          <p className="text-gray-300 text-sm mb-4">
            Digite o caminho absoluto de uma pasta no seu computador (servidor) contendo vídeos <code>.mp4</code> ou <code>.mkv</code>. O sistema irá registrar todos automaticamente como Filmes.
          </p>

          <form onSubmit={handleScan} className="flex flex-col gap-3 mt-auto">
            <div className="relative">
              <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                placeholder="Ex: C:/Meus Filmes" 
                className="w-full bg-[#111] border border-[#444] rounded py-2 pl-10 pr-4 text-white focus:outline-none focus:border-netflix-red"
                required
              />
            </div>
            
            <button 
              type="submit"
              disabled={scanning || !folderPath}
              className="w-full flex items-center justify-center gap-2 bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 text-white py-3 px-4 rounded font-medium transition"
            >
              {scanning ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <FolderSearch size={20} />
              )}
              {scanning ? 'Escaneando...' : 'Iniciar Sincronização'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
