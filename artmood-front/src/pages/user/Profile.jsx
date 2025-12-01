// pages/user/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { followerService } from '../../services/followerService';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [obras, setObras] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({ 
    followers: 0, 
    following: 0, 
    obras: 0,
    likes: 0,
    comments: 0
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // Cambiado a 'dashboard'

  useEffect(() => {
    if (!authLoading && user) {
      loadProfileData();
    } else if (!authLoading && !user) {
      setProfileLoading(false);
    }
  }, [user, authLoading]);

  const loadProfileData = async () => {
    try {
      setProfileLoading(true);
      setProfile(user);

      const allWorks = await obraService.getAll();
      const userWorks = allWorks.filter(work => work.id_usuario === user.id);
      setObras(userWorks);

      // Actividad reciente mejorada
      const mockActivity = [
        { type: 'like', user: 'Ana García', obra: 'Soledad Urbana', time: '2 horas ago', obraId: 1 },
        { type: 'comment', user: 'Carlos Ruiz', obra: 'Noche Estrellada', time: '5 horas ago', obraId: 2 },
        { type: 'follow', user: 'Laura Martínez', time: '1 día ago' },
        { type: 'upload', obra: 'Atardecer Digital', time: '2 días ago', obraId: 3 }
      ];
      setRecentActivity(mockActivity);

      // Cargar estadísticas
      try {
        const [followersRes, followingRes] = await Promise.allSettled([
          followerService.getFollowers(user.id),
          followerService.getFollowing(user.id)
        ]);

        const followersCount = followersRes.status === 'fulfilled' 
          ? (followersRes.value?.data?.length || followersRes.value?.length || 0)
          : 0;
        
        const followingCount = followingRes.status === 'fulfilled'
          ? (followingRes.value?.data?.length || followersRes.value?.length || 0)
          : 0;

        const totalLikes = userWorks.reduce((sum, obra) => sum + (obra.likes || 0), 0);
        const totalComments = userWorks.reduce((sum, obra) => sum + (obra.comments || 0), 0);

        setStats({
          followers: followersCount,
          following: followingCount,
          obras: userWorks.length,
          likes: totalLikes,
          comments: totalComments
        });

      } catch (followError) {
        console.error('Error cargando seguidores:', followError);
        setStats({
          followers: 0,
          following: 0,
          obras: userWorks.length,
          likes: 0,
          comments: 0
        });
      }

    } catch (error) {
      console.error('❌ Error cargando perfil:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleEditProfile = () => {
    alert('🚧 Función de editar perfil en desarrollo');
  };

  const renderActivityIcon = (type) => {
    switch(type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'upload': return '🎨';
      default: return '🔔';
    }
  };

  // Función para obtener la obra más popular
  const getMostPopularObra = () => {
    if (obras.length === 0) return null;
    return obras.reduce((prev, current) => 
      (prev.likes || 0) > (current.likes || 0) ? prev : current
    );
  };

  // Función para obtener obras recientes
  const getRecentObras = () => {
    return obras
      .sort((a, b) => new Date(b.fecha_publicacion || 0) - new Date(a.fecha_publicacion || 0))
      .slice(0, 3);
  };

  if (authLoading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <LoadingSpinner text="Verificando sesión..." />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <Card>
            <h2>No autenticado</h2>
            <p>Debes iniciar sesión para ver tu perfil.</p>
            <Button onClick={() => window.location.href = '/login'}>
              Ir a Iniciar Sesión
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <LoadingSpinner text="Cargando tu perfil..." />
        </div>
      </div>
    );
  }

  const mostPopularObra = getMostPopularObra();
  const recentObras = getRecentObras();

  return (
    <div className="profile-container">
      {/* Header del perfil (sin cambios) */}
      <div className="profile-hero">
        <div className="profile-background"></div>
        <Card className="profile-header">
          <div className="profile-info">
            <div className="avatar-section">
              <img 
                src={user?.foto_perfil || '/default-avatar.png'} 
                alt={user?.nombre}
                className="profile-avatar"
              />
              <div className="online-indicator"></div>
            </div>
            
            <div className="profile-details">
              <div className="profile-main">
                <h1 className="profile-name">
                  {user?.nombre || 'Usuario'}
                </h1>
                <div className="verification-badge">
                  <span>✓ Verificado</span>
                </div>
              </div>
              <p className="profile-username">
                @{user?.nickname || 'sin-nickname'}
              </p>
              <p className="profile-bio">
                {user?.bio || 'Artista en ArtMood 🎨'}
              </p>
              
              <div className="profile-stats">
                <div className="stat">
                  <div className="stat-number" style={{color: '#10b981'}}>{stats.obras}</div>
                  <div className="stat-label">Obras</div>
                </div>
                <div className="stat">
                  <div className="stat-number" style={{color: '#3b82f6'}}>{stats.followers}</div>
                  <div className="stat-label">Seguidores</div>
                </div>
                <div className="stat">
                  <div className="stat-number" style={{color: '#8b5cf6'}}>{stats.following}</div>
                  <div className="stat-label">Siguiendo</div>
                </div>
                <div className="stat">
                  <div className="stat-number" style={{color: '#f59e0b'}}>{stats.likes}</div>
                  <div className="stat-label">Me gusta</div>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Button 
                variant="primary" 
                className="edit-button"
                onClick={handleEditProfile}
              >
                ✏️ Editar Perfil
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs modificados - cambiado "estadísticas" por "dashboard" */}
      <Card className="tabs-container">
        <div className="tabs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`tab ${activeTab === 'dashboard' ? 'tab-active' : ''}`}
          >
            <span className="tab-icon">📋</span>
            <span className="tab-label">Dashboard</span>
            {activeTab === 'dashboard' && <div className="tab-indicator"></div>}
          </button>
          
          <button
            onClick={() => setActiveTab('actividad')}
            className={`tab ${activeTab === 'actividad' ? 'tab-active' : ''}`}
          >
            <span className="tab-icon">🔔</span>
            <span className="tab-label">Actividad</span>
            {activeTab === 'actividad' && <div className="tab-indicator"></div>}
          </button>
          
          <button
            onClick={() => setActiveTab('logros')}
            className={`tab ${activeTab === 'logros' ? 'tab-active' : ''}`}
          >
            <span className="tab-icon">🏆</span>
            <span className="tab-label">Logros</span>
            {activeTab === 'logros' && <div className="tab-indicator"></div>}
          </button>

          <button
            onClick={() => setActiveTab('seguidores')}
            className={`tab ${activeTab === 'seguidores' ? 'tab-active' : ''}`}
          >
            <span className="tab-icon">👥</span>
            <span className="tab-label">Seguidores</span>
            {activeTab === 'seguidores' && <div className="tab-indicator"></div>}
          </button>
        </div>
      </Card>

      {/* Contenido de tabs */}
      <div className="tab-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Dashboard de Arte</h2>
              <p>Gestión y análisis de tu portafolio</p>
            </div>
            
            <div className="dashboard-grid">
              {/* Obra destacada */}
              {mostPopularObra && (
                <Card className="dashboard-card highlight">
                  <div className="card-header">
                    <div className="card-icon">🔥</div>
                    <h3>Tu Obra Más Popular</h3>
                  </div>
                  <div className="obra-popular">
                    <div className="obra-info">
                      <h4>{mostPopularObra.titulo || 'Sin título'}</h4>
                      <p>{mostPopularObra.descripcion || 'Sin descripción'}</p>
                      <div className="obra-stats">
                        <span className="stat-badge likes">❤️ {mostPopularObra.likes || 0} likes</span>
                        <span className="stat-badge comments">💬 {mostPopularObra.comments || 0} comentarios</span>
                        <span className="stat-badge views">👁️ {mostPopularObra.views || 0} vistas</span>
                      </div>
                    </div>
                    <div className="obra-image-placeholder">
                      <div className="image-content">
                        {mostPopularObra.categoria?.charAt(0).toUpperCase() || 'A'}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Obras recientes */}
              <Card className="dashboard-card">
                <div className="card-header">
                  <div className="card-icon">🕒</div>
                  <h3>Obras Recientes</h3>
                </div>
                <div className="recent-works-list">
                  {recentObras.length > 0 ? recentObras.map((obra, index) => (
                    <div key={index} className="recent-work-item">
                      <div className="work-thumbnail"></div>
                      <div className="work-details">
                        <strong>{obra.titulo || 'Obra sin título'}</strong>
                        <span>{new Date(obra.fecha_publicacion).toLocaleDateString() || 'Fecha desconocida'}</span>
                      </div>
                      <div className="work-stats">
                        <span className="mini-stat">❤️ {obra.likes || 0}</span>
                        <span className="mini-stat">💬 {obra.comments || 0}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="empty-state">Aún no tienes obras publicadas</p>
                  )}
                </div>
                {obras.length > 0 && (
                  <Button variant="outline" size="small" fullWidth>
                    Ver todas las obras ({obras.length})
                  </Button>
                )}
              </Card>

              {/* Resumen de rendimiento */}
              <Card className="dashboard-card">
                <div className="card-header">
                  <div className="card-icon">📈</div>
                  <h3>Resumen de Rendimiento</h3>
                </div>
                <div className="performance-summary">
                  <div className="performance-item">
                    <div className="performance-label">Tasa de Interacción</div>
                    <div className="performance-value">
                      {obras.length > 0 
                        ? `${((stats.likes + stats.comments) / obras.length).toFixed(1)} por obra`
                        : '0'
                      }
                    </div>
                    <div className="performance-bar">
                      <div 
                        className="performance-fill" 
                        style={{
                          width: `${Math.min((stats.likes + stats.comments) / (obras.length * 10) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="performance-item">
                    <div className="performance-label">Crecimiento de Seguidores</div>
                    <div className="performance-value">+{Math.floor(stats.followers * 0.1)} esta semana</div>
                    <div className="performance-bar">
                      <div 
                        className="performance-fill secondary" 
                        style={{width: '45%'}}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="performance-item">
                    <div className="performance-label">Consistencia</div>
                    <div className="performance-value">
                      {obras.length >= 5 ? '🥇 Excelente' : obras.length >= 2 ? '🥈 Bueno' : '🥉 Comenzando'}
                    </div>
                    <div className="performance-bar">
                      <div 
                        className="performance-fill accent" 
                        style={{width: `${Math.min(obras.length * 20, 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Consejos y sugerencias */}
              <Card className="dashboard-card tips">
                <div className="card-header">
                  <div className="card-icon">💡</div>
                  <h3>Consejos para Crecer</h3>
                </div>
                <div className="tips-list">
                  <div className={`tip-item ${stats.obras >= 3 ? 'completed' : ''}`}>
                    <div className="tip-icon">🎯</div>
                    <div className="tip-content">
                      <strong>Publica 3 obras</strong>
                      <p>Muestra variedad en tu portafolio</p>
                      <span className="tip-progress">
                        {stats.obras}/3 completado
                      </span>
                    </div>
                  </div>
                  <div className={`tip-item ${stats.followers >= 10 ? 'completed' : ''}`}>
                    <div className="tip-icon">👥</div>
                    <div className="tip-content">
                      <strong>Conecta con otros artistas</strong>
                      <p>Sigue y comenta obras de otros</p>
                      <span className="tip-progress">
                        {stats.followers}/10 seguidores
                      </span>
                    </div>
                  </div>
                  <div className={`tip-item ${stats.comments >= 5 ? 'completed' : ''}`}>
                    <div className="tip-icon">💬</div>
                    <div className="tip-content">
                      <strong>Interactúa con tu audiencia</strong>
                      <p>Responde a comentarios en tus obras</p>
                      <span className="tip-progress">
                        {stats.comments}/5 comentarios recibidos
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'actividad' && (
          // ... (mantén el mismo contenido de actividad)
          <div className="activity-section">
            <div className="section-header">
              <h2>Actividad Reciente</h2>
              <p>Todas las interacciones en tu contenido</p>
            </div>
            
            <Card className="activity-feed">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    {renderActivityIcon(activity.type)}
                  </div>
                  <div className="activity-content">
                    {activity.type === 'like' && (
                      <p>
                        <strong>{activity.user}</strong> dio me gusta a tu obra 
                        <strong> "{activity.obra}"</strong>
                      </p>
                    )}
                    {activity.type === 'comment' && (
                      <p>
                        <strong>{activity.user}</strong> comentó en tu obra 
                        <strong> "{activity.obra}"</strong>
                      </p>
                    )}
                    {activity.type === 'follow' && (
                      <p>
                        <strong>{activity.user}</strong> comenzó a seguirte
                      </p>
                    )}
                    {activity.type === 'upload' && (
                      <p>
                        Publicaste una nueva obra: 
                        <strong> "{activity.obra}"</strong>
                      </p>
                    )}
                    <span className="activity-time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {activeTab === 'logros' && (
          // ... (mantén el mismo contenido de logros)
          <div className="achievements-section">
            <div className="section-header">
              <h2>Mis Logros</h2>
              <p>Recompensas y reconocimientos obtenidos</p>
            </div>
            
            <div className="achievements-grid">
              <Card className="achievement-card unlocked">
                <div className="achievement-icon">🎯</div>
                <h3>Primeros Pasos</h3>
                <p>Publica tu primera obra</p>
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '100%'}}></div>
                  </div>
                  <span>Completado</span>
                </div>
              </Card>

              <Card className="achievement-card unlocked">
                <div className="achievement-icon">❤️</div>
                <h3>Popular</h3>
                <p>Consigue 50 me gusta</p>
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: '70%'}}></div>
                  </div>
                  <span>{stats.likes}/50</span>
                </div>
              </Card>

              <Card className="achievement-card locked">
                <div className="achievement-icon">👥</div>
                <h3>Influencer</h3>
                <p>Alcanza 100 seguidores</p>
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${Math.min(stats.followers, 100)}%`}}></div>
                  </div>
                  <span>{stats.followers}/100</span>
                </div>
              </Card>

              <Card className="achievement-card locked">
                <div className="achievement-icon">🎨</div>
                <h3>Productivo</h3>
                <p>Publica 10 obras</p>
                <div className="achievement-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${(stats.obras / 10) * 100}%`}}></div>
                  </div>
                  <span>{stats.obras}/10</span>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'seguidores' && (
          // ... (mantén el mismo contenido de seguidores)
          <div className="followers-section">
            <div className="section-header">
              <h2>Comunidad</h2>
              <p>Gestiona tus conexiones en ArtMood</p>
            </div>
            
            <div className="followers-content">
              <Card className="followers-card">
                <h3>🎯 Sugerencias para seguir</h3>
                <div className="suggestions-list">
                  <div className="suggestion-item">
                    <div className="user-avatar"></div>
                    <div className="user-info">
                      <strong>Carlos Mendoza</strong>
                      <span>Fotógrafo urbano</span>
                    </div>
                    <Button size="small" variant="primary">Seguir</Button>
                  </div>
                  <div className="suggestion-item">
                    <div className="user-avatar"></div>
                    <div className="user-info">
                      <strong>Ana Torres</strong>
                      <span>Artista digital</span>
                    </div>
                    <Button size="small" variant="primary">Seguir</Button>
                  </div>
                </div>
              </Card>

              <Card className="followers-stats">
                <h3>📈 Tendencias de Crecimiento</h3>
                <div className="growth-stats">
                  <div className="growth-item">
                    <span className="growth-number">+{stats.followers}</span>
                    <span className="growth-label">Seguidores totales</span>
                  </div>
                  <div className="growth-item">
                    <span className="growth-number">+12%</span>
                    <span className="growth-label">Crecimiento mensual</span>
                  </div>
                  <div className="growth-item">
                    <span className="growth-number">#{stats.following}</span>
                    <span className="growth-label">Artistas siguiendo</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;