import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/user', label: 'Galería', icon: '🎨' },
    { path: '/user/my-obras', label: 'Mis Obras', icon: '📂' },
    { path: '/user/upload', label: 'Subir Obra', icon: '📤' },
    { path: '/user/profile', label: 'Mi Perfil', icon: '👤' },
  ];

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/user" className="text-xl font-bold text-purple-600">
            ArtMood
          </Link>

          <div className="flex items-center space-x-6">
            {/* Navegación */}
            <div className="flex space-x-4">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === item.path
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Usuario y logout */}
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-6">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">@{user?.nickname}</p>
              </div>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;