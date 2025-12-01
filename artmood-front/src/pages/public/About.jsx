import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            Conectando <span className="about-gradient-text">Emociones</span> a través del Arte Digital
          </h1>
          <p className="about-hero-description">
            ArtMood es más que una galería: es un espacio donde el arte digital encuentra su voz emocional, 
            conectando artistas y amantes del arte a través de sentimientos compartidos.
          </p>
          <div className="about-hero-stats">
            <div className="about-stat">
              <div className="about-stat-number">100+</div>
              <div className="about-stat-label">Artistas</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-number">500+</div>
              <div className="about-stat-label">Obras</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-number">12+</div>
              <div className="about-stat-label">Emociones</div>
            </div>
          </div>
        </div>
        <div className="about-hero-graphics">
          <div className="about-art-showcase">
            <div className="about-art-piece about-art-1">🖼️</div>
            <div className="about-art-piece about-art-2">🎨</div>
            <div className="about-art-piece about-art-3">✨</div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission-section">
        <div className="about-mission-container">
          <Card className="about-mission-card" hover padding="large">
            <div className="about-mission-icon">🎯</div>
            <h2>Nuestra Misión</h2>
            <p className="about-mission-text">
              Crear un ecosistema digital donde cada obra de arte cuente una historia emocional, 
              permitiendo a los artistas expresar sus sentimientos y a los espectadores descubrir 
              arte que resuene con sus propias experiencias emocionales.
            </p>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="about-features-section">
        <div className="about-features-container">
          <h2 className="about-section-title">¿Qué hace especial a ArtMood?</h2>
          <div className="about-features-grid">
            <Card className="about-feature-card" hover padding="large">
              <div className="about-feature-icon">✨</div>
              <h3>Galería Emocional</h3>
              <p>Clasifica y descubre arte basado en emociones específicas como alegría, tristeza, nostalgia o inspiración.</p>
            </Card>

            <Card className="about-feature-card" hover padding="large">
              <div className="about-feature-icon">🔄</div>
              <h3>Interacción Auténtica</h3>
              <p>Reacciona con emociones específicas y comenta cómo el arte te hace sentir.</p>
            </Card>

            <Card className="about-feature-card" hover padding="large">
              <div className="about-feature-icon">🌍</div>
              <h3>Comunidad Global</h3>
              <p>Conecta con artistas de todo el mundo que comparten tus mismas pasiones emocionales.</p>
            </Card>

            <Card className="about-feature-card" hover padding="large">
              <div className="about-feature-icon">🚀</div>
              <h3>Plataforma Moderna</h3>
              <p>Tecnología de vanguardia para una experiencia fluida y envolvente.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="about-tech-section">
        <div className="about-tech-container">
          <h2 className="about-section-title">Tecnología que Impulsa la Creatividad</h2>
          <div className="about-tech-grid">
            <div className="about-tech-item">
              <div className="about-tech-icon about-react">⚛️</div>
              <h4>React.js</h4>
              <p>Interfaz moderna y reactiva</p>
            </div>
            <div className="about-tech-item">
              <div className="about-tech-icon about-laravel">🔷</div>
              <h4>Laravel</h4>
              <p>API robusta y segura</p>
            </div>
            <div className="about-tech-item">
              <div className="about-tech-icon about-mysql">🗄️</div>
              <h4>MySQL</h4>
              <p>Base de datos confiable</p>
            </div>
            <div className="about-tech-item">
              <div className="about-tech-icon about-jwt">🔐</div>
              <h4>JWT</h4>
              <p>Autenticación segura</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team-section">
        <div className="about-team-container">
          <h2 className="about-section-title">Nuestro Equipo Creativo</h2>
          <div className="about-team-grid">
            <Card className="about-team-card" hover padding="large">
              <div className="about-team-avatar">👩‍💻</div>
              <h3>Daniela Uscanga Reyes</h3>
              <p className="about-team-role">Desarrolladora Frontend & Diseñadora UX</p>
              <p className="about-team-id">22CG0143</p>
              <div className="about-team-skills">
                <span className="about-skill-tag">React</span>
                <span className="about-skill-tag">CSS</span>
                <span className="about-skill-tag">UI/UX</span>
              </div>
            </Card>

            <Card className="about-team-card" hover padding="large">
              <div className="about-team-avatar">👨‍💻</div>
              <h3>Rafael Luján Olivas</h3>
              <p className="about-team-role">Desarrollador Backend & Arquitecto de API</p>
              <p className="about-team-id">22CG0249</p>
              <div className="about-team-skills">
                <span className="about-skill-tag">Laravel</span>
                <span className="about-skill-tag">MySQL</span>
                <span className="about-skill-tag">API</span>
              </div>
            </Card>
          </div>
          
          <Card className="about-institution-card" hover padding="large">
            <div className="about-institution-icon">🏫</div>
            <h3>Instituto Tecnológico Superior de Nuevo Casas Grandes</h3>
            <p>Proyecto desarrollado como parte de nuestra formación profesional en ingeniería</p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta-section">
        <div className="about-cta-container">
          <Card className="about-cta-card" hover padding="large">
            <h2>¿Listo para Expresar tus Emociones?</h2>
            <p>Únete a nuestra comunidad y descubre cómo el arte puede conectar corazones</p>
            <div className="about-cta-buttons">
              <Button 
                variant="primary" 
                size="large"
                onClick={() => navigate('/register')}
                className="about-cta-btn-primary"
              >
                🎨 Comenzar Ahora
              </Button>
              <Button 
                variant="secondary" 
                size="large"
                onClick={() => navigate('/gallery')}
                className="about-cta-btn-secondary"
              >
                🖼️ Explorar Galería
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;