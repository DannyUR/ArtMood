import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { userService } from '../../services/userService';
import { categoryService } from '../../services/categoryService';
import { emotionService } from '../../services/emotionService'; // Nuevo servicio para emociones
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalObras: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
    totalEmociones: 0, // Nueva estadística para emociones
    obrasRecientes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [obrasData, usuariosData, categoriasData] = await Promise.all([
        obraService.getAll(),
        userService.getAll(),
        categoryService.getAll(),
        // Agregar aquí el servicio de emociones cuando lo tengas
        emotionService.getAll()
      ]);

      setStats({
        totalObras: obrasData.length,
        totalUsuarios: usuariosData.length,
        totalCategorias: categoriasData.length,
        totalEmociones: 8, // Cambiar esto por datos reales
        obrasRecientes: obrasData.slice(0, 5) // Últimas 5 obras
      });
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="am-dashboard-loading-container">
        <div className="am-dashboard-spinner"></div>
      </div>
    );
  }

  return (
    <div className="am-dashboard-container">
      {/* Encabezado con gradiente */}
      <div className="am-dashboard-header">
        <div className="am-dashboard-header-content">
          <h1 className="am-dashboard-title">
            Panel de Administración
          </h1>
          <p className="am-dashboard-subtitle">
            Bienvenido, <span className="am-dashboard-user-name">{user?.name}</span>. Gestiona la plataforma ArtMood.
          </p>
        </div>
        <div className="am-dashboard-header-decorations">
          <div className="am-dashboard-dot am-dashboard-dot-1"></div>
          <div className="am-dashboard-dot am-dashboard-dot-2"></div>
          <div className="am-dashboard-dot am-dashboard-dot-3"></div>
        </div>
      </div>
      
      {/* Tarjetas de estadísticas con diseño creativo */}
      <div className="am-dashboard-stats-grid">
        {/* Tarjeta de obras */}
        <div className="am-dashboard-stat-card am-dashboard-stat-card-artwork">
          <div className="am-dashboard-stat-card-icon-container">
            <div className="am-dashboard-stat-card-icon">
              🎨
            </div>
          </div>
          <div className="am-dashboard-stat-card-content">
            <p className="am-dashboard-stat-card-label">Total Obras</p>
            <p className="am-dashboard-stat-card-value">{stats.totalObras}</p>
            <div className="am-dashboard-stat-card-progress">
              <div className="am-dashboard-stat-card-progress-bar" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="am-dashboard-stat-card-decoration">
            <div className="am-dashboard-stat-card-dot am-dashboard-stat-card-dot-1"></div>
            <div className="am-dashboard-stat-card-dot am-dashboard-stat-card-dot-2"></div>
          </div>
        </div>
        
        {/* Tarjeta de usuarios */}
        <div className="am-dashboard-stat-card am-dashboard-stat-card-users">
          <div className="am-dashboard-stat-card-icon-container">
            <div className="am-dashboard-stat-card-icon">
              👥
            </div>
          </div>
          <div className="am-dashboard-stat-card-content">
            <p className="am-dashboard-stat-card-label">Usuarios Registrados</p>
            <p className="am-dashboard-stat-card-value">{stats.totalUsuarios}</p>
            <div className="am-dashboard-stat-card-progress">
              <div className="am-dashboard-stat-card-progress-bar" style={{ width: '70%' }}></div>
            </div>
          </div>
          <div className="am-dashboard-stat-card-decoration">
            <div className="am-dashboard-stat-card-dot am-dashboard-stat-card-dot-1"></div>
            <div className="am-dashboard-stat-card-dot am-dashboard-stat-card-dot-2"></div>
          </div>
        </div>
        
        {/* Tarjeta de categorías */}
        <div className="am-dashboard-stat-card am-dashboard-stat-card-categories">
          <div className="am-dashboard-stat-card-icon-container">
            <div className="am-dashboard-stat-card-icon">
              📂
            </div>
          </div>
          <div className="am-dashboard-stat-card-content">
            <p className="am-dashboard-stat-card-label">Categorías</p>
            <p className="am-dashboard-stat-card-value">{stats.totalCategorias}</p>
            <div className="am-dashboard-stat-card-progress">
              <div className="am-dashboard-stat-card-progress-bar" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="am-dashboard-stat-card-decoration">
            <div className="am-dashboard-stat-card-dot am-dashboard-stat-card-dot-1"></div>
            <div className="am-dashboard-stat-card-dot am-dashboard-stat-card-dot-2"></div>
          </div>
        </div>

        {/* NUEVA: Tarjeta de emociones */}
        <div className="am-dashboard-stat-card am-dashboard-stat-card-emotions">
          <div className="am-dashboard-stat-card-icon-container">
            <div className="am-dashboard-stat-card-icon">
              😊
            </div>
          </div>
          <div className="am-dashboard-stat-card-content">
            <p className="am-dashboard-stat-card-label">Emociones</p>
            <p className="am-dashboard-stat-card-value">{stats.totalEmociones}</p>
            <div className="am-dashboard-stat-card-progress">
              <div className="am-dashboard-stat-card-progress-bar" style={{ width: '45%' }}></div>
            </div>
          </div>
          <div className="am-dashboard-stat-card-decoration">
            <div className="am-dashboard-stat-card-dot am-dashboard-stat-card-dot-1"></div>
            <div className="am-dashboard-stat-card-dot am-dashboard-stat-card-dot-2"></div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="am-dashboard-main-content">
        {/* Sección de obras recientes */}
        <div className="am-dashboard-section am-dashboard-recent-works">
          <div className="am-dashboard-section-header">
            <h2 className="am-dashboard-section-title">Obras Recientes</h2>
            <div className="am-dashboard-section-decoration">
              <span className="am-dashboard-section-decoration-line"></span>
            </div>
          </div>
          
          <div className="am-dashboard-recent-works-list">
            {stats.obrasRecientes.map(obra => (
              <div key={obra.id_obra} className="am-dashboard-recent-work-card">
                <div className="am-dashboard-recent-work-gradient">
                  <div className="am-dashboard-recent-work-icon">
                    🎨
                  </div>
                </div>
                <div className="am-dashboard-recent-work-info">
                  <h3 className="am-dashboard-recent-work-title">
                    {obra.title}
                  </h3>
                  <p className="am-dashboard-recent-work-author">
                    por <span>{obra.user?.nickname || 'Anónimo'}</span>
                  </p>
                  <div className="am-dashboard-recent-work-meta">
                    <span className="am-dashboard-recent-work-date">
                      {new Date(obra.fecha_publicacion).toLocaleDateString()}
                    </span>
                    <span className="am-dashboard-recent-work-tag">
                      Reciente
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {stats.obrasRecientes.length === 0 && (
              <div className="am-dashboard-empty-state">
                <div className="am-dashboard-empty-state-icon">🎨</div>
                <p className="am-dashboard-empty-state-text">No hay obras recientes</p>
                <p className="am-dashboard-empty-state-subtext">Las nuevas obras aparecerán aquí</p>
              </div>
            )}
          </div>
        </div>

        {/* Sección de acciones rápidas */}
        <div className="am-dashboard-section am-dashboard-quick-actions">
          <div className="am-dashboard-section-header">
            <h2 className="am-dashboard-section-title">Acciones Rápidas</h2>
            <div className="am-dashboard-section-decoration">
              <span className="am-dashboard-section-decoration-line"></span>
            </div>
          </div>
          
          <div className="am-dashboard-quick-actions-list">
            <a href="/admin/obras" className="am-dashboard-quick-action-card am-dashboard-quick-action-artwork">
              <div className="am-dashboard-quick-action-icon">
                🎨
              </div>
              <div className="am-dashboard-quick-action-content">
                <h3 className="am-dashboard-quick-action-title">Gestionar Obras</h3>
                <p className="am-dashboard-quick-action-description">Ver, editar y eliminar obras</p>
              </div>
              <div className="am-dashboard-quick-action-arrow">
                →
              </div>
            </a>
            
            <a href="/admin/usuarios" className="am-dashboard-quick-action-card am-dashboard-quick-action-users">
              <div className="am-dashboard-quick-action-icon">
                👥
              </div>
              <div className="am-dashboard-quick-action-content">
                <h3 className="am-dashboard-quick-action-title">Gestionar Usuarios</h3>
                <p className="am-dashboard-quick-action-description">Administrar usuarios registrados</p>
              </div>
              <div className="am-dashboard-quick-action-arrow">
                →
              </div>
            </a>
            
            <a href="/admin/categorias" className="am-dashboard-quick-action-card am-dashboard-quick-action-categories">
              <div className="am-dashboard-quick-action-icon">
                📂
              </div>
              <div className="am-dashboard-quick-action-content">
                <h3 className="am-dashboard-quick-action-title">Gestionar Categorías</h3>
                <p className="am-dashboard-quick-action-description">Administrar categorías de obras</p>
              </div>
              <div className="am-dashboard-quick-action-arrow">
                →
              </div>
            </a>

            {/* NUEVA: Acción rápida para Emociones */}
            <a href="/admin/emociones" className="am-dashboard-quick-action-card am-dashboard-quick-action-emotions">
              <div className="am-dashboard-quick-action-icon">
                😊
              </div>
              <div className="am-dashboard-quick-action-content">
                <h3 className="am-dashboard-quick-action-title">Gestionar Emociones</h3>
                <p className="am-dashboard-quick-action-description">Administrar emociones y estados de ánimo</p>
              </div>
              <div className="am-dashboard-quick-action-arrow">
                →
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;