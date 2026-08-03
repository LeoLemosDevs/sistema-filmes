import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Páginas e Layouts
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Player } from './pages/Player';
import { SearchResults } from './pages/SearchResults';
import { MyList } from './pages/MyList';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminContent } from './pages/AdminContent';
import { AdminTools } from './pages/AdminTools';
import { AdminEpisodes } from './pages/AdminEpisodes';

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Toaster position="top-right" toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }} />
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Rotas Protegidas - Usuário Comum */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/series" element={<Home />} />
              <Route path="/movies" element={<Home />} />
              <Route path="/trending" element={<Home />} />
              <Route path="/watch/:id" element={<Player />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/mylist" element={<MyList />} />
            </Route>

            {/* Rotas Protegidas - Área Administrativa */}
            <Route element={<ProtectedRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="series/:id/episodes" element={<AdminEpisodes />} />
                <Route path="users" element={<div className="text-white text-xl">Página de Gerenciamento de Usuários</div>} />
                <Route path="tools" element={<AdminTools />} />
              </Route>
            </Route>

            {/* Rota Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
