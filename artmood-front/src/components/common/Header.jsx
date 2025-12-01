// components/common/Header.jsx - VERSIÓN CORREGIDA
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  const handleProfile = () => {
    navigate('/user/profile');
    setIsDropdownOpen(false);
  };

  const handleMyObras = () => {
    navigate('/user/my-obras');
    setIsDropdownOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-container">
        
        {/* Logo - Esquina Izquierda */}
        <div className="logo-section">
          <Link to="/" className="logo">
            🎨 ArtMood
          </Link>
        </div>

        {/* Navegación Central */}
        <nav className="center-nav">
          <Link to="/" className="nav-link">
            Inicio
          </Link>
          {/* CORREGIDO: Cambiado de /gallery a /user */}
          <Link to="/user" className="nav-link">
            Galería
          </Link>
          <Link to="/about" className="nav-link">
            Sobre Nosotros
          </Link>
          {user && (
            // CORREGIDO: Cambiado de /upload a /user/upload
            <Link to="/user/upload" className="nav-link">
              Subir Obra
            </Link>
          )}
        </nav>

        {/* Sección Usuario - Esquina Derecha */}
        <div className="user-section">
          {user ? (
            // Usuario logueado - Dropdown de perfil
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className="user-avatar">
                  {user.nombre?.charAt(0) || user.username?.charAt(0) || 'U'}
                </span>
                <span className="user-name">
                  {user.nombre || user.username || 'Usuario'}
                </span>
                <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
                  ▼
                </span>
              </button>
              
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button onClick={handleProfile} className="dropdown-item">
                    👤 Mi Perfil
                  </button>
                  <button onClick={handleMyObras} className="dropdown-item">
                    🖼️ Mis Obras
                  </button>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    🚪 Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Usuario no logueado - Botón Comenzar
            <div className="guest-actions">
              <Link to="/register" className="get-started-btn">
                Comenzar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;