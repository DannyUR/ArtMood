import React, { useState, useEffect } from 'react';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';
import './ObrasManagement.css';

const ObrasManagement = () => {
  const [obras, setObras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    loadObras();
    loadCategorias();
  }, []);

  const loadObras = async () => {
    try {
      setLoading(true);
      const obrasData = await obraService.getAll();
      setObras(obrasData);
    } catch (error) {
      console.error('Error cargando obras:', error);
      setError('Error al cargar las obras');
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

  const handleDeleteObra = async (obraId, obraTitle) => {
    if (window.confirm(`¿Estás seguro de eliminar la obra "${obraTitle}"?`)) {
      try {
        await obraService.delete(obraId);
        setObras(obras.filter(obra => obra.id_obra !== obraId));
        alert('Obra eliminada correctamente');
      } catch (error) {
        console.error('Error eliminando obra:', error);
        alert('Error al eliminar la obra');
      }
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

  // Filtrar obras
  const filteredObras = obras.filter(obra => {
    const matchesSearch = obra.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obra.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         obra.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || obra.id_categoria?.toString() === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="am-artworks-loading-container">
        <div className="am-artworks-spinner"></div>
        <p className="am-artworks-loading-text">Cargando obras...</p>
      </div>
    );
  }

  return (
    <div className="am-artworks-container">
      {/* Encabezado */}
      <div className="am-artworks-header">
        <div className="am-artworks-header-content">
          <h1 className="am-artworks-title">
            <span className="am-artworks-title-icon">🎨</span>
            Gestión de Obras
          </h1>
          <p className="am-artworks-subtitle">
            Administra las <span className="am-artworks-count">{obras.length}</span> obras publicadas en ArtMood
          </p>
        </div>
        <div className="am-artworks-header-decorations">
          <div className="am-artworks-dot am-artworks-dot-1"></div>
          <div className="am-artworks-dot am-artworks-dot-2"></div>
          <div className="am-artworks-dot am-artworks-dot-3"></div>
        </div>
      </div>

      {/* Panel de advertencia */}
      <div className="am-artworks-alert">
        <div className="am-artworks-alert-icon">⚠️</div>
        <div className="am-artworks-alert-content">
          <h3 className="am-artworks-alert-title">Permisos de administrador</h3>
          <p className="am-artworks-alert-text">
            Como administrador, puedes eliminar obras que incumplan las normas de la comunidad.
            <br />
            La edición de obras está reservada para los artistas propietarios.
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="am-artworks-filters">
        <div className="am-artworks-search">
          <div className="am-artworks-search-icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar obras por título, descripción o artista..."
            className="am-artworks-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="am-artworks-category-filter">
          <select
            className="am-artworks-filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">Todas las categorías</option>
            {categorias.map(categoria => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="am-artworks-stats-grid">
        <div className="am-artworks-stat-card am-artworks-stat-total">
          <div className="am-artworks-stat-icon">🎨</div>
          <div className="am-artworks-stat-content">
            <h3 className="am-artworks-stat-number">{obras.length}</h3>
            <p className="am-artworks-stat-label">Total Obras</p>
          </div>
        </div>

        <div className="am-artworks-stat-card am-artworks-stat-artists">
          <div className="am-artworks-stat-icon">👥</div>
          <div className="am-artworks-stat-content">
            <h3 className="am-artworks-stat-number">
              {new Set(obras.map(obra => obra.id_usuario)).size}
            </h3>
            <p className="am-artworks-stat-label">Artistas Únicos</p>
          </div>
        </div>

        <div className="am-artworks-stat-card am-artworks-stat-categories">
          <div className="am-artworks-stat-icon">📂</div>
          <div className="am-artworks-stat-content">
            <h3 className="am-artworks-stat-number">{categorias.length}</h3>
            <p className="am-artworks-stat-label">Categorías</p>
          </div>
        </div>

        <div className="am-artworks-stat-card am-artworks-stat-emotions">
          <div className="am-artworks-stat-icon">😊</div>
          <div className="am-artworks-stat-content">
            <h3 className="am-artworks-stat-number">
              {new Set(obras.filter(obra => obra.id_emocion).map(obra => obra.id_emocion)).size}
            </h3>
            <p className="am-artworks-stat-label">Emociones Únicas</p>
          </div>
        </div>
      </div>

      {/* Lista de obras */}
      <div className="am-artworks-list-container">
        <div className="am-artworks-list-header">
          <h2 className="am-artworks-list-title">
            <span className="am-artworks-list-title-icon">📋</span>
            Lista de Obras
            <span className="am-artworks-list-count">({filteredObras.length})</span>
          </h2>
          <div className="am-artworks-list-actions">
            <button 
              className="am-artworks-refresh-btn"
              onClick={loadObras}
            >
              <span className="am-artworks-refresh-icon">🔄</span>
              Actualizar
            </button>
          </div>
        </div>

        {filteredObras.length === 0 ? (
          <div className="am-artworks-empty-state">
            <div className="am-artworks-empty-icon">🎨</div>
            <h3 className="am-artworks-empty-title">No se encontraron obras</h3>
            <p className="am-artworks-empty-text">
              {searchTerm || filterCategory !== 'all' 
                ? 'Intenta con otros términos de búsqueda o categorías'
                : 'Las obras aparecerán aquí cuando los usuarios las publiquen'}
            </p>
          </div>
        ) : (
          <div className="am-artworks-grid">
            {filteredObras.map((obra) => (
              <div key={obra.id_obra} className="am-artwork-card">
                {/* Imagen de la obra */}
                <div className="am-artwork-image-container">
                  {obra.imagen ? (
                    <img
                      className="am-artwork-image"
                      src={`http://localhost:8000/storage/${obra.imagen}`}
                      alt={obra.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=🎨';
                      }}
                    />
                  ) : (
                    <div className="am-artwork-placeholder">
                      <span className="am-artwork-placeholder-icon">🎨</span>
                    </div>
                  )}
                  <div className="am-artwork-overlay">
                    <span className="am-artwork-id">ID: {obra.id_obra}</span>
                  </div>
                </div>

                {/* Información de la obra */}
                <div className="am-artwork-content">
                  <h3 className="am-artwork-title" title={obra.title}>
                    {obra.title}
                  </h3>
                  
                  <p className="am-artwork-description" title={obra.description}>
                    {obra.description || 'Sin descripción'}
                  </p>

                  {/* Detalles */}
                  <div className="am-artwork-details">
                    <div className="am-artwork-detail">
                      <span className="am-artwork-detail-label">📅</span>
                      <span className="am-artwork-detail-value">
                        {new Date(obra.fecha_publicacion).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="am-artwork-detail">
                      <span className="am-artwork-detail-label">👨‍🎨</span>
                      <span className="am-artwork-detail-value">
                        {obra.user?.name || 'Anónimo'}
                      </span>
                    </div>
                  </div>

                  {/* Categoría y emoción */}
                  <div className="am-artwork-tags">
                    <span className="am-artwork-tag am-artwork-tag-category">
                      {getCategoriaNombre(obra.id_categoria)}
                    </span>
                    
                    {obra.emotion && (
                      <span className="am-artwork-tag am-artwork-tag-emotion">
                        <span className="am-artwork-emotion-icon">
                          {getEmojiEmocion(obra.emotion)}
                        </span>
                        {obra.emotion.name}
                      </span>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="am-artwork-actions">
                    <a
                      href={`/user/edit-obra/${obra.id_obra}`}
                      className="am-artwork-action-btn am-artwork-action-view"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="am-artwork-action-icon">👁️</span>
                      Ver
                    </a>
                    
                    <button
                      onClick={() => handleDeleteObra(obra.id_obra, obra.title)}
                      className="am-artwork-action-btn am-artwork-action-delete"
                    >
                      <span className="am-artwork-action-icon">🗑️</span>
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="am-artworks-error">
          <div className="am-artworks-error-icon">❌</div>
          <p className="am-artworks-error-text">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ObrasManagement;