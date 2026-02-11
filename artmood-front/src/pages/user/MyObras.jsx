import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';
import EditObraModal from '../../components/modals/EditObraModal';
import ConfirmModal from '../../components/modals/ConfirmModal';
import ArtworkImage from '../../components/ArtworkImage';
import './MyObras.css';

const MyObras = () => {
  const { user } = useAuth();
  const [obras, setObras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para el modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedObraId, setSelectedObraId] = useState(null);

  // Estado para modal de confirmación
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [obraToDelete, setObraToDelete] = useState(null);

  useEffect(() => {
    loadMyObras();
    loadCategorias();
  }, []);

  // Función para encontrar la obra más reciente
  const getObraMasReciente = () => {
    if (!obras || obras.length === 0) return null;

    // Ordenar obras por fecha (más reciente primero)
    const obrasOrdenadas = [...obras].sort((a, b) => {
      // Usar diferentes posibles nombres de campo de fecha
      const fechaA = new Date(
        a.fecha_publicacion ||
        a.published_at ||
        a.created_at ||
        a.updated_at ||
        Date.now()
      );

      const fechaB = new Date(
        b.fecha_publicacion ||
        b.published_at ||
        b.created_at ||
        b.updated_at ||
        Date.now()
      );

      return fechaB.getTime() - fechaA.getTime(); // Más reciente primero
    });

    return obrasOrdenadas[0];
  };

  // Función para fecha relativa (opcional)
  const getFechaRelativa = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const fechaObra = new Date(dateString);
      const ahora = new Date();
      const diffMs = ahora - fechaObra;
      const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDias === 0) return 'Hoy';
      if (diffDias === 1) return 'Ayer';
      if (diffDias < 7) return `Hace ${diffDias} días`;
      if (diffDias < 30) return `Hace ${Math.floor(diffDias / 7)} semana${Math.floor(diffDias / 7) > 1 ? 's' : ''}`;

      // Si es más de un mes, mostrar fecha normal
      return formatDate(dateString);
    } catch (error) {
      return formatDate(dateString);
    }
  };

  // Función para abrir el modal de edición
  const openEditModal = (obraId) => {
    setSelectedObraId(obraId);
    setIsEditModalOpen(true);
  };

  // Función para cerrar el modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedObraId(null);
  };

  // Función para recargar después de editar
  const handleEditSuccess = () => {
    loadMyObras();
  };

  // Función para abrir modal de confirmación
  const openDeleteConfirm = (obraId, obraTitle) => {
    setObraToDelete({
      id: obraId,
      title: obraTitle
    });
    setIsConfirmModalOpen(true);
  };

  // Función para cerrar modal de confirmación
  const closeDeleteConfirm = () => {
    setIsConfirmModalOpen(false);
    setObraToDelete(null);
  };

  // Función para eliminar obra
  const handleDeleteConfirm = async () => {
    if (!obraToDelete) return;

    try {
      await obraService.delete(obraToDelete.id);
      setObras(obras.filter(obra => obra.id_obra !== obraToDelete.id));
      console.log(`Obra "${obraToDelete.title}" eliminada correctamente`);
    } catch (error) {
      console.error('Error eliminando obra:', error);
      alert('Error al eliminar la obra');
    }
  };

  const loadMyObras = async () => {
    try {
      setLoading(true);
      const todasLasObras = await obraService.getAll();

      // Filtrar solo las obras del usuario actual
      const misObras = todasLasObras.filter(obra =>
        obra.id_usuario === (user.id_usuario || user.id)
      );

      setObras(misObras);
    } catch (error) {
      console.error('Error cargando mis obras:', error);
      setError('Error al cargar tus obras');
    } finally {
      setLoading(false);
    }
  };

  const loadCategorias = async () => {
    try {
      const categoriasData = await categoryService.getAll();
      setCategorias(categoriasData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const handleDeleteObra = (obraId, obraTitle) => {
    openDeleteConfirm(obraId, obraTitle);
  };

  const getCategoriaNombre = (idCategoria) => {
    const categoria = categorias.find(cat => cat.id_categoria === idCategoria);
    return categoria ? categoria.name : 'Sin categoría';
  };

  const getEmojiEmocion = (emocion) => {
    if (!emocion) return '🎨';
    return emocion.icon || '🎨';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  if (loading) {
    return (
      <div className="myobras-loading">
        <div className="myobras-loading-spinner"></div>
        <p>Cargando tus obras...</p>
      </div>
    );
  }

  return (
    <div className="myobras-container">
      {/* Header Section */}
      <div className="myobras-header">
        <div className="myobras-header-content">
          <div className="myobras-header-badge">
            <span>Tu Colección Personal</span>
          </div>
          <h1 className="myobras-page-title">Mis Obras</h1>
          <p className="myobras-page-subtitle">
            Gestiona las {obras.length} obras que has publicado en ArtMood
          </p>
        </div>
        <Link
          to="/user/upload"
          className="myobras-upload-cta-btn"
        >
          <span className="myobras-btn-icon">🎨</span>
          <span className="myobras-btn-text">Subir Nueva Obra</span>
        </Link>
      </div>

      {error && (
        <div className="myobras-error-message">
          <div className="myobras-error-icon">⚠️</div>
          <div className="myobras-error-content">
            <h4>Error al cargar tus obras</h4>
            <p>{error}</p>
          </div>
          <button onClick={loadMyObras} className="myobras-retry-btn">
            Reintentar
          </button>
        </div>
      )}

      {/* Stats Cards Mejoradas */}
      <div className="myobras-stats-grid">
        <div className="myobras-stat-card myobras-stat-primary">
          <div className="myobras-stat-content">
            <div className="myobras-stat-icon">🎨</div>
            <div className="myobras-stat-info">
              <div className="myobras-stat-number">{obras.length}</div>
              <div className="myobras-stat-label">Total de Obras</div>
            </div>
          </div>
          <div className="myobras-stat-wave"></div>
        </div>

        <div className="myobras-stat-card myobras-stat-secondary">
          <div className="myobras-stat-content">
            <div className="myobras-stat-icon">📅</div>
            <div className="myobras-stat-info">
              <div className="myobras-stat-number">
                {obras.length > 0 ?
                  getFechaRelativa(getObraMasReciente()?.published_at) :
                  'Sin obras'}
              </div>
              <div className="myobras-stat-label">Más Reciente</div>
            </div>
          </div>
          <div className="myobras-stat-wave"></div>
        </div>

        <div className="myobras-stat-card myobras-stat-accent">
          <div className="myobras-stat-content">
            <div className="myobras-stat-icon">👁️</div>
            <div className="myobras-stat-info">
              <div className="myobras-stat-number">{obras.length}</div>
              <div className="myobras-stat-label">En Exhibición</div>
            </div>
          </div>
          <div className="myobras-stat-wave"></div>
        </div>

        <div className="myobras-stat-card myobras-stat-warning">
          <div className="myobras-stat-content">
            <div className="myobras-stat-icon">😊</div>
            <div className="myobras-stat-info">
              <div className="myobras-stat-number">
                {new Set(obras.filter(obra => obra.id_emocion).map(obra => obra.id_emocion)).size}
              </div>
              <div className="myobras-stat-label">Emociones Únicas</div>
            </div>
          </div>
          <div className="myobras-stat-wave"></div>
        </div>
      </div>

      {/* Grid de Obras - Diseño Mejorado */}
      <div className="myobras-grid-section">
        <div className="myobras-section-header">
          <h2 className="myobras-section-title">Tu Galería Personal</h2>
          <p className="myobras-section-subtitle">
            Todas las obras que has compartido con la comunidad
          </p>
        </div>

        <div className="myobras-grid">
          {obras.map((obra, index) => (
            <div key={obra.id_obra} className="myobras-card">
              {/* Header de la Tarjeta */}
              <div className="myobras-card-header">
                <div className="myobras-image-container">
                  <ArtworkImage
                    obra={obra}
                    className="myobras-image"
                    onError={(e) => {
                      console.log('Error cargando imagen');
                    }}
                  />
                  <div className="myobras-image-fallback">
                    <span className="myobras-fallback-icon">🎨</span>
                  </div>
                </div>

                {/* Badge de acciones */}
                <div className="myobras-action-badge">
                  <button
                    onClick={() => openEditModal(obra.id_obra)}
                    className="myobras-action-btn myobras-edit-btn"
                    title="Editar obra"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteObra(obra.id_obra, obra.title)}
                    className="myobras-action-btn myobras-delete-btn"
                    title="Eliminar obra"
                  >
                    🗑️
                  </button>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="myobras-card-content">
                  <div className="myobras-info">
                    <h3 className="myobras-title">{obra.title}</h3>
                    <p className="myobras-description">
                      {obra.description || 'Sin descripción disponible'}
                    </p>
                  </div>

                  <div className="myobras-meta">
                    <div className="myobras-meta-item">
                      <span className="myobras-meta-label">Categoría</span>
                      <span className="myobras-meta-value myobras-categoria-badge">
                        {getCategoriaNombre(obra.id_categoria)}
                      </span>
                    </div>

                    {obra.emotion && (
                      <div className="myobras-meta-item">
                        <span className="myobras-meta-label">Emoción</span>
                        <span className="myobras-meta-value myobras-emotion-badge">
                          <span className="myobras-emotion-emoji">{getEmojiEmocion(obra.emotion)}</span>
                          {obra.emotion.name}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="myobras-footer">
                    <div className="myobras-publish-info">
                      <span className="myobras-publish-date">
                        📅 {formatDate(obra.fecha_publicacion)}
                      </span>
                      <span className="myobras-obra-id">ID: #{obra.id_obra}</span>
                    </div>

                    <div className="myobras-action-links">
                      <Link
                        to="/gallery"
                        className="myobras-view-link"
                      >
                        👁️ Ver en Galería
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      <EditObraModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        obraId={selectedObraId}
        onSuccess={handleEditSuccess}
      />

      {/* NUEVO MODAL DE CONFIRMACIÓN */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={closeDeleteConfirm}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Obra"
        message={`¿Estás seguro de eliminar la obra "${obraToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Empty State Mejorado */}
      {obras.length === 0 && (
        <div className="myobras-empty-state">
          <div className="myobras-empty-illustration">
            <div className="myobras-empty-icon">🎨</div>
            <div className="myobras-empty-sparkles">
              <span>✨</span>
              <span>✨</span>
              <span>✨</span>
            </div>
          </div>
          <h3 className="myobras-empty-title">Tu galería está esperando</h3>
          <p className="myobras-empty-description">
            Comparte tu primera obra y comienza tu journey artístico en ArtMood
          </p>
          <Link
            to="/user/upload"
            className="myobras-empty-cta-btn"
          >
            <span className="myobras-empty-btn-icon">🚀</span>
            <span className="myobras-empty-btn-text">Publicar Mi Primera Obra</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyObras;