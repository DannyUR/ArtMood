import React from 'react';
import CommentsSection from '../comments/CommentsSection';
import './ObraDetailModal.css';

const ObraDetailModal = ({ obra, isOpen, onClose }) => {
  if (!isOpen || !obra) return null;

  // Función para formatear la fecha correctamente
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  return (
    <div className="gallery-modal-overlay" onClick={onClose}>
      <div 
        className="gallery-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del Modal */}
        <div className="gallery-modal-header">
          <div className="gallery-modal-header-content">
            <h2 className="gallery-modal-title">{obra.title}</h2>
            <p className="gallery-modal-subtitle">
              Una obra creada con ❤️ por nuestra comunidad
            </p>
          </div>
          <button
            onClick={onClose}
            className="gallery-modal-close-btn"
          >
            <span className="gallery-modal-close-icon">×</span>
          </button>
        </div>

        {/* Contenido Principal */}
        <div className="gallery-modal-body">
          <div className="gallery-modal-obra-layout">
            {/* Sección de Imagen */}
            <div className="gallery-modal-image-section">
              {obra.imagen ? (
                <div className="gallery-modal-image-container">
                  <img
                    src={`http://localhost:8000/storage/${obra.imagen}`}
                    alt={obra.title}
                    className="gallery-modal-obra-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="gallery-modal-image-fallback">
                    <span className="gallery-modal-fallback-icon">🎨</span>
                    <p>Imagen no disponible</p>
                  </div>
                </div>
              ) : (
                <div className="gallery-modal-image-placeholder">
                  <span className="gallery-modal-placeholder-icon">🖼️</span>
                  <p>Sin imagen</p>
                </div>
              )}
              
              {/* Efectos visuales */}
              <div className="gallery-modal-image-overlay">
                <div className="gallery-modal-overlay-badge">
                  <span className="gallery-modal-badge-icon">✨</span>
                  <span>Obra Destacada</span>
                </div>
              </div>
            </div>

            {/* Sección de Información */}
            <div className="gallery-modal-info-section">
              {/* Header de información */}
              <div className="gallery-modal-info-header">
                <div className="gallery-modal-artist-info">
                  <div className="gallery-modal-artist-avatar">
                    {obra.user?.nickname?.charAt(0)?.toUpperCase() || 'A'}
                  </div>
                  <div className="gallery-modal-artist-details">
                    <h3 className="gallery-modal-artist-name">
                      {obra.user?.nickname || 'Artista Anónimo'}
                    </h3>
                    <p className="gallery-modal-artist-role">Creador de la obra</p>
                  </div>
                </div>
                <div className="gallery-modal-action-buttons">
                  <button className="gallery-modal-action-btn gallery-modal-like-btn">
                    <span className="gallery-modal-btn-icon">❤️</span>
                    <span className="gallery-modal-btn-text">Me gusta</span>
                  </button>
                  <button className="gallery-modal-action-btn gallery-modal-share-btn">
                    <span className="gallery-modal-btn-icon">↗️</span>
                    <span className="gallery-modal-btn-text">Compartir</span>
                  </button>
                </div>
              </div>

              {/* Descripción */}
              <div className="gallery-modal-description-section">
                <h4 className="gallery-modal-section-title">
                  <span className="gallery-modal-title-icon">📝</span>
                  Descripción
                </h4>
                <p className="gallery-modal-description-text">
                  {obra.description || 'El artista no ha proporcionado una descripción para esta obra.'}
                </p>
              </div>

              {/* Metadatos */}
              <div className="gallery-modal-metadata-grid">
                <div className="gallery-modal-metadata-item">
                  <div className="gallery-modal-metadata-icon">📅</div>
                  <div className="gallery-modal-metadata-content">
                    <span className="gallery-modal-metadata-label">Publicado</span>
                    <span className="gallery-modal-metadata-value">
                      {formatDate(obra.fecha_publicacion)}
                    </span>
                  </div>
                </div>

                <div className="gallery-modal-metadata-item">
                  <div className="gallery-modal-metadata-icon">🏷️</div>
                  <div className="gallery-modal-metadata-content">
                    <span className="gallery-modal-metadata-label">Categoría</span>
                    <span className="gallery-modal-metadata-value">
                      {obra.categoria?.name || 'Sin categoría'}
                    </span>
                  </div>
                </div>

                {obra.emotion && (
                  <div className="gallery-modal-metadata-item">
                    <div className="gallery-modal-metadata-icon">😊</div>
                    <div className="gallery-modal-metadata-content">
                      <span className="gallery-modal-metadata-label">Emoción</span>
                      <span className="gallery-modal-metadata-value">
                        {obra.emotion.icon} {obra.emotion.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="gallery-modal-metadata-item">
                  <div className="gallery-modal-metadata-icon">🆔</div>
                  <div className="gallery-modal-metadata-content">
                    <span className="gallery-modal-metadata-label">ID de Obra</span>
                    <span className="gallery-modal-metadata-value">#{obra.id_obra}</span>
                  </div>
                </div>
              </div>

              {/* Etiquetas */}
              <div className="gallery-modal-tags-section">
                <h4 className="gallery-modal-section-title">
                  <span className="gallery-modal-title-icon">🏷️</span>
                  Etiquetas
                </h4>
                <div className="gallery-modal-tags-container">
                  {obra.id_categoria && (
                    <span className="gallery-modal-tag gallery-modal-tag-category">
                      {obra.categoria?.name || 'Categoría'}
                    </span>
                  )}
                  {obra.emotion && (
                    <span className="gallery-modal-tag gallery-modal-tag-emotion">
                      {obra.emotion.icon} {obra.emotion.name}
                    </span>
                  )}
                  <span className="gallery-modal-tag gallery-modal-tag-digital">Arte Digital</span>
                  <span className="gallery-modal-tag gallery-modal-tag-community">Comunidad</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Comentarios */}
          <div className="gallery-modal-comments-section">
            <CommentsSection obraId={obra.id_obra} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObraDetailModal;