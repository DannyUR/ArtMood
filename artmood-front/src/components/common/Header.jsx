import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-purple-600">
          ArtMood
        </Link>
        
        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-700">Hola, {user.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-purple-600">
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;