import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';
import ObraDetailModal from '../../components/obra/ObraDetailModal';
import ReactionButton from '../../components/reactions/ReactionButton';
import './Gallery.css';

const Gallery = () => {
  const { user } = useAuth();
  const [obras, setObras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedObra, setSelectedObra] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reactionsMap, setReactionsMap] = useState({});

  useEffect(() => {
    loadObras();
    loadCategorias();
  }, []);

  const loadObras = async () => {
    try {
      setLoading(true);
      const obrasData = await obraService.getAll();
      console.log('📦 Obras cargadas:', obrasData);
      setObras(obrasData);
    } catch (error) {
      console.error('Error cargando obras:', error);
      setError('Error al cargar las obras');
    } finally {
      setLoading(false);
    }
  };

  // NUEVO: Función para actualizar reacciones de una obra específica
  const updateReactionsForObra = async (obraId) => {
    try {
      const reactionService = await import('../../services/reactionService');
      const reactionData = await reactionService.default.getReactionsByWork(obraId);

      setReactionsMap(prev => ({
        ...prev,
        [obraId]: reactionData
      }));

      console.log(`🔄 Reacciones actualizadas para obra ${obraId}:`, reactionData);
      return reactionData;
    } catch (error) {
      console.error(`❌ Error actualizando reacciones para obra ${obraId}:`, error);
      return null;
    }
  };

  // NUEVO: Callback cuando ReactionButton actualiza reacciones
  const handleReactionUpdate = (obraId, reactionData) => {
    setReactionsMap(prev => ({
      ...prev,
      [obraId]: reactionData
    }));
  };

  const loadCategorias = async () => {
    try {
      const categoriasData = await categoryService.getAll();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const getCategoriaNombre = (idCategoria) => {
    const categoria = categorias.find(cat => cat.id_categoria === idCategoria);
    return categoria ? categoria.name : 'Sin categoría';
  };

  const getEmojiEmocion = (emocion) => {
    if (!emocion) return '🎨';
    return emocion.icon || '🎨';
  };

  const openObraDetail = (obra) => {
    console.log('🎨 Abriendo modal para obra:', obra.id_obra, obra.title);
    setSelectedObra(obra);
    setIsModalOpen(true);
  };

  const closeObraDetail = () => {
    console.log('🔒 Cerrando modal');
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedObra(null);
    }, 300);
  };

  // Prevenir que el clic se propague cuando haces clic en botones dentro de la tarjeta
  const handleCardClick = (e, obra) => {
    // Solo abrir modal si no se hizo clic en un botón
    if (!e.target.closest('button') && !e.target.closest('.reaction-button-container')) {
      openObraDetail(obra);
    }
  };

  // Formatear fecha de publicación
  const formatPublishDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      const fecha = new Date(dateString);
      return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="gallery-loading-spinner"></div>
        <p>Cargando galería...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-error">
        <div className="gallery-error-container">
          <div className="gallery-error-icon">⚠️</div>
          <h3>Error al cargar la galería</h3>
          <p>{error}</p>
          <button onClick={loadObras} className="gallery-retry-btn">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="gallery-hero-content">
          <div className="gallery-hero-badge">
            <span>Explora Nuestra Colección</span>
          </div>
          <h1 className="gallery-hero-title">
            Galería de <span className="gallery-gradient-text">Arte Digital</span>
          </h1>
          <p className="gallery-hero-subtitle">
            Descubre {obras.length} obras únicas creadas por nuestra comunidad creativa
          </p>

          <div className="gallery-hero-actions">
            {user ? (
              <Link to="/user/upload" className="gallery-upload-cta-btn">
                <span className="gallery-btn-icon">🎨</span>
                <span className="gallery-btn-text">Crear Nueva Obra</span>
              </Link>
            ) : (
              <Link to="/register" className="gallery-join-cta-btn">
                <span className="gallery-btn-icon">👥</span>
                <span className="gallery-btn-text">Únete a la Comunidad</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="gallery-stats">
        <div className="gallery-stats-container">
          <div className="gallery-stat-card gallery-stat-primary">
            <div className="gallery-stat-content">
              <div className="gallery-stat-icon">🎨</div>
              <div className="gallery-stat-info">
                <div className="gallery-stat-number">{obras.length}</div>
                <div className="gallery-stat-label">Obras en Galería</div>
              </div>
            </div>
            <div className="gallery-stat-wave"></div>
          </div>

          <div className="gallery-stat-card gallery-stat-secondary">
            <div className="gallery-stat-content">
              <div className="gallery-stat-icon">👥</div>
              <div className="gallery-stat-info">
                <div className="gallery-stat-number">
                  {new Set(obras.map(obra => obra.id_usuario)).size}
                </div>
                <div className="gallery-stat-label">Artistas Creativos</div>
              </div>
            </div>
            <div className="gallery-stat-wave"></div>
          </div>

          <div className="gallery-stat-card gallery-stat-accent">
            <div className="gallery-stat-content">
              <div className="gallery-stat-icon">📂</div>
              <div className="gallery-stat-info">
                <div className="gallery-stat-number">{categorias.length}</div>
                <div className="gallery-stat-label">Categorías Únicas</div>
              </div>
            </div>
            <div className="gallery-stat-wave"></div>
          </div>
        </div>
      </section>

      {/* Artworks Grid */}
      <section className="gallery-artworks-section">
        <div className="gallery-section-header">
          <h2 className="gallery-section-title">Obras Destacadas</h2>
          <p className="gallery-section-subtitle">
            Explora las creaciones más recientes de nuestra comunidad
          </p>
        </div>

        {obras.length > 0 ? (
          <div className="gallery-artworks-grid">
            {obras.map((obra) => (
              <article
                key={obra.id_obra}
                className="gallery-artwork-card"
                onClick={(e) => handleCardClick(e, obra)}
              >
                {/* Image Container */}
                <div className="gallery-artwork-image-container">
                  {obra.image ? (
                    <img
                      src={`http://localhost:8000/storage/${obra.image}`}
                      alt={obra.title}
                      className="gallery-artwork-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="gallery-artwork-image-fallback">
                    <span className="gallery-fallback-icon">🎨</span>
                  </div>

                  {/* Overlay */}
                  <div className="gallery-artwork-overlay">
                    <div className="gallery-overlay-content">
                      <button className="gallery-view-button">
                        👁️ Ver Detalles
                      </button>
                      <span className="gallery-emotion-badge">
                        {getEmojiEmocion(obra.emotion)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="gallery-artwork-content">
                  <div className="gallery-artwork-header">
                    <h3 className="gallery-artwork-title">{obra.title}</h3>
                    <span className="gallery-category-tag">
                      {getCategoriaNombre(obra.id_categoria)}
                    </span>
                  </div>

                  <p className="gallery-artwork-description">
                    {obra.description
                      ? (obra.description.length > 100
                        ? `${obra.description.substring(0, 100)}...`
                        : obra.description)
                      : 'Una obra llena de creatividad y emoción...'}
                  </p>

                  <div className="gallery-artwork-footer">
                    <div className="gallery-artist-info">
                      <div className="gallery-artist-avatar">
                        {obra.user?.nickname?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <div className="gallery-artist-details">
                        <span className="gallery-artist-name">
                          por {obra.user?.nickname || 'Artista Anónimo'}
                        </span>
                        <span className="gallery-publish-date">
                          {formatPublishDate(obra.published_at)}
                        </span>
                      </div>
                    </div>

                    {/* NUEVO: Pasar callback y reacciones iniciales */}
                    <ReactionButton
                      obra={obra}
                      onReactionUpdate={(data) => handleReactionUpdate(obra.id_obra, data)}
                      initialReactions={reactionsMap[obra.id_obra]}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="gallery-empty-gallery">
            <div className="gallery-empty-illustration">
              <div className="gallery-empty-icon">🎨</div>
              <div className="gallery-empty-sparkles">
                <span>✨</span>
                <span>✨</span>
                <span>✨</span>
              </div>
            </div>
            <h3 className="gallery-empty-title">La galería está esperando tu arte</h3>
            <p className="gallery-empty-description">
              Sé el primero en compartir tu creatividad con la comunidad
            </p>
            <Link to="/user/upload" className="gallery-empty-cta-btn">
              <span className="gallery-empty-btn-icon">🚀</span>
              <span className="gallery-empty-btn-text">Subir Primera Obra</span>
            </Link>
          </div>
        )}
      </section>

      {/* Call to Action */}
      {!user && obras.length > 0 && (
        <section className="gallery-cta">
          <div className="gallery-cta-container">
            <div className="gallery-cta-content">
              <h2>¿Listo para compartir tu arte?</h2>
              <p>Únete a nuestra comunidad y comienza a expresar tus emociones a través del arte digital</p>
              <div className="gallery-cta-buttons">
                <Link to="/register" className="gallery-cta-btn gallery-cta-primary">
                  Crear Cuenta
                </Link>
                <Link to="/login" className="gallery-cta-btn gallery-cta-secondary">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modal - NUEVO: Pasar reacciones y callback */}
      {selectedObra && (
        <ObraDetailModal
          key={`obra-modal-${selectedObra.id_obra}`}
          obra={selectedObra}
          isOpen={isModalOpen}
          onClose={closeObraDetail}
          initialReactions={reactionsMap[selectedObra.id_obra]}
          onReactionUpdate={(data) => handleReactionUpdate(selectedObra.id_obra, data)}
        />
      )}
    </div>
  );
};

export default Gallery;