import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import './Home.css';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-hero-background">
          <div className="home-floating-shapes">
            <div className="home-shape home-shape-1">🎨</div>
            <div className="home-shape home-shape-2">✨</div>
            <div className="home-shape home-shape-3">❤️</div>
            <div className="home-shape home-shape-4">🌟</div>
          </div>
        </div>
        
        <div className="home-hero-container">
          <div className="home-hero-content">
            <div className="home-hero-badge">
              <span>Bienvenido a</span>
            </div>
            <h1 className="home-hero-title">
              Art<span className="home-gradient-text">Mood</span>
            </h1>
            <p className="home-hero-subtitle">Galería interactiva de arte digital</p>
            
            {user ? (
              <div className="home-user-welcome">
                <h2 className="home-welcome-message">¡Hola, {user.nombre || user.username || 'Usuario'}! 😊</h2>
                <p className="home-welcome-text">Bienvenido de vuelta a nuestra comunidad creativa</p>
                <div className="home-action-buttons">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/gallery')}
                    className="home-gallery-btn"
                  >
                    🖼️ Explorar Galería
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => navigate('/upload')}
                    className="home-upload-btn"
                  >
                    🎨 Subir Obra
                  </Button>
                </div>
              </div>
            ) : (
              <div className="home-guest-welcome">
                <p className="home-guest-text">Descubre y comparte arte digital que expresa emociones</p>
                <div className="home-action-buttons">
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/register')}
                    className="home-primary-btn"
                  >
                    Comenzar Ahora
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="lg"
                    onClick={() => navigate('/login')}
                    className="home-secondary-btn"
                  >
                    Iniciar Sesión
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Stats Section */}
          <div className="home-hero-stats">
            <div className="home-stat-item">
              <div className="home-stat-number">500+</div>
              <div className="home-stat-label">Obras de Arte</div>
            </div>
            <div className="home-stat-item">
              <div className="home-stat-number">100+</div>
              <div className="home-stat-label">Artistas</div>
            </div>
            <div className="home-stat-item">
              <div className="home-stat-number">12+</div>
              <div className="home-stat-label">Emociones</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="home-features-section">
        <div className="home-section-header">
          <h2 className="home-section-title">¿Por qué unirte a ArtMood?</h2>
          <p className="home-section-subtitle">Descubre una nueva forma de conectar con el arte digital</p>
        </div>
        <div className="home-features-grid">
          <Card className="home-feature-card" hover>
            <div className="home-feature-icon-wrapper">
              <div className="home-feature-icon">🎨</div>
            </div>
            <h3>Comparte tu Arte</h3>
            <p>Publica tus ilustraciones, dibujos y fotografías digitales con la comunidad.</p>
            <div className="home-feature-arrow">→</div>
          </Card>
          
          <Card className="home-feature-card" hover>
            <div className="home-feature-icon-wrapper">
              <div className="home-feature-icon">❤️</div>
            </div>
            <h3>Conecta Emociones</h3>
            <p>Asocia emociones a tus obras y descubre arte basado en sentimientos.</p>
            <div className="home-feature-arrow">→</div>
          </Card>
          
          <Card className="home-feature-card" hover>
            <div className="home-feature-icon-wrapper">
              <div className="home-feature-icon">👥</div>
            </div>
            <h3>Comunidad Creativa</h3>
            <p>Interactúa con otros artistas mediante comentarios y reacciones.</p>
            <div className="home-feature-arrow">→</div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="home-cta-section">
          <div className="home-cta-card">
            <h2>¿Listo para comenzar tu viaje artístico?</h2>
            <p>Únete a nuestra comunidad y descubre un mundo de emociones a través del arte digital</p>
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="home-cta-button"
            >
              🎨 Crear Cuenta Gratis
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;