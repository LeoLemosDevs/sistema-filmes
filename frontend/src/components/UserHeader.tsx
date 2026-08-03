import React, { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { LogOut, Search, Bell } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const UserHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        <div className="flex items-center gap-8">
          <Link to="/">
            <h1 className="text-netflix-red text-2xl md:text-3xl font-black uppercase tracking-wider">Filmes Stream</h1>
          </Link>
          <nav className="hidden md:flex gap-5 text-sm font-medium">
            <Link to="/" className={`transition ${location.pathname === '/' ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}`}>Início</Link>
            <Link to="/series" className={`transition ${location.pathname === '/series' ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}`}>Séries</Link>
            <Link to="/movies" className={`transition ${location.pathname === '/movies' ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}`}>Filmes</Link>
            <Link to="/trending" className={`transition ${location.pathname === '/trending' ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}`}>Bombando</Link>
            <Link to="/mylist" className={`transition ${location.pathname === '/mylist' ? 'text-white font-bold' : 'text-gray-300 hover:text-white'}`}>Minha lista</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center">
            <form 
              onSubmit={handleSearchSubmit}
              className={`flex items-center bg-black/60 border ${searchOpen ? 'border-white px-2 py-1' : 'border-transparent'} transition-all duration-300`}
            >
              <Search 
                className="text-white cursor-pointer hover:text-gray-300 transition" 
                size={24} 
                onClick={toggleSearch}
              />
              <input 
                ref={searchInputRef}
                type="text"
                placeholder="Títulos, gente e gêneros"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent text-white outline-none transition-all duration-300 ${searchOpen ? 'w-48 ml-2 opacity-100' : 'w-0 ml-0 opacity-0'}`}
              />
            </form>
          </div>
          
          <Bell className="text-white cursor-pointer hidden md:block hover:text-gray-300 transition" size={24} />
          
          <div className="group relative flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 rounded bg-netflix-red flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="absolute right-0 top-full mt-4 w-48 bg-black/95 border border-gray-800 rounded opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 shadow-2xl">
              <div className="p-4 flex flex-col gap-3">
                <span className="text-sm text-gray-300 border-b border-gray-700 pb-2 truncate">{user?.email}</span>
                {user?.role === 'admin' && (
                  <Link to="/admin/dashboard" className="text-sm text-white hover:underline">Painel Admin</Link>
                )}
                <button onClick={logout} className="flex items-center gap-2 text-sm text-white hover:underline mt-2">
                  <LogOut size={16} /> Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
