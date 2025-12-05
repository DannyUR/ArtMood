import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/obras', label: 'Gestionar Obras', icon: '🎨' },
    { path: '/admin/usuarios', label: 'Usuarios', icon: '👥' },
    { path: '/admin/categorias', label: 'Categorías', icon: '📂' },
    { path: '/admin/emociones', label: 'Emociones', icon: '😊' },
  ];

  return (
    <div className="am-sidebar">
      {/* Logo y título */}
      <div className="am-sidebar-header">
        <div className="am-sidebar-logo">
          <div className="am-sidebar-logo-icon">🎨</div>
          <div className="am-sidebar-logo-text">
            <h1 className="am-sidebar-title">ArtMood</h1>
            <p className="am-sidebar-subtitle">Panel de Administración</p>
          </div>
        </div>
        <div className="am-sidebar-header-decoration">
          <div className="am-sidebar-dot am-sidebar-dot-1"></div>
          <div className="am-sidebar-dot am-sidebar-dot-2"></div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="am-sidebar-nav">
        <ul className="am-sidebar-menu">
          {menuItems.map(item => (
            <li key={item.path} className="am-sidebar-menu-item">
              <Link
                to={item.path}
                className={`am-sidebar-link ${location.pathname === item.path ? 'am-sidebar-link-active' : ''
                  }`}
              >
                <span className="am-sidebar-link-icon">{item.icon}</span>
                <span className="am-sidebar-link-label">{item.label}</span>
                {location.pathname === item.path && (
                  <div className="am-sidebar-link-indicator"></div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Perfil y logout */}
      <div className="am-sidebar-footer">
        <div className="am-sidebar-user">
          <div className="am-sidebar-user-avatar">
            <div className="am-sidebar-user-avatar-initial">
              {user?.name?.charAt(0)}
            </div>
            <div className="am-sidebar-user-status"></div>
          </div>
          <div className="am-sidebar-user-info">
            <p className="am-sidebar-user-name">{user?.name}</p>
            <p className="am-sidebar-user-email">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="am-sidebar-logout-btn"
        >
          <span className="am-sidebar-logout-icon">🚪</span>
          <span className="am-sidebar-logout-text">Cerrar Sesión</span>
        </button>
        <div className="am-sidebar-footer-decoration">
          <div className="am-sidebar-footer-dot am-sidebar-footer-dot-1"></div>
          <div className="am-sidebar-footer-dot am-sidebar-footer-dot-2"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;