import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { LayoutDashboard, Film, Users, LogOut } from 'lucide-react';

export const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex bg-[#141414]">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-[#333] hidden md:flex flex-col">
        <div className="p-6 border-b border-[#333]">
          <h2 className="text-netflix-red text-xl font-bold uppercase tracking-wider">Admin Panel</h2>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link to="/admin/dashboard" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#333] p-3 rounded transition-colors">
            <LayoutDashboard size={20} /> <span className="font-medium">Dashboard</span>
          </Link>
          <Link to="/admin/content" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#333] p-3 rounded transition-colors">
            <Film size={20} /> <span className="font-medium">Conteúdo</span>
          </Link>
          <Link to="/admin/users" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#333] p-3 rounded transition-colors">
            <Users size={20} /> <span className="font-medium">Usuários</span>
          </Link>
          <Link to="/admin/tools" className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#333] p-3 rounded transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg> <span className="font-medium">Ferramentas</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-[#333]">
          <button onClick={logout} className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#333] w-full p-3 rounded transition-colors">
            <LogOut size={20} /> <span className="font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="h-16 bg-black border-b border-[#333] flex items-center justify-between px-8">
          <h1 className="text-xl font-medium text-white">Administração</h1>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm hidden sm:block">Olá, {user?.name}</span>
            <div className="w-9 h-9 rounded bg-netflix-red flex items-center justify-center text-white font-bold text-lg shadow">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
