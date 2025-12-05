import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import './CategoriesManagement.css';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Colores para las categorías
  const categoryColors = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #4299e1, #38b2ac)',
    'linear-gradient(135deg, #48bb78, #38a169)',
    'linear-gradient(135deg, #ed8936, #dd6b20)',
    'linear-gradient(135deg, #ed64a6, #d53f8c)',
    'linear-gradient(135deg, #9f7aea, #805ad5)',
    'linear-gradient(135deg, #0bc5ea, #00b5d8)',
    'linear-gradient(135deg, #68d391, #38a169)'
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await categoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    setFormLoading(true);
    setError('');

    try {
      const updatedCategory = await categoryService.update(editingCategory.id_categoria, formData);

      // Actualizar la lista de categorías
      setCategories(categories.map(cat =>
        cat.id_categoria === editingCategory.id_categoria
          ? { ...cat, ...updatedCategory }
          : cat
      ));

      closeEditModal();
      alert('Categoría actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      const errorMessage = error.response?.data?.message ||
        'Error al actualizar la categoría';
      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const closeEditModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setError('');
  };

  const closeCreateModal = () => {
    setShowCreateForm(false);
    setFormData({ name: '', description: '' });
    setError('');
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) {
      try {
        await categoryService.delete(categoryId);
        setCategories(categories.filter(cat => cat.id_categoria !== categoryId));
        alert('Categoría eliminada correctamente');
      } catch (error) {
        console.error('Error eliminando categoría:', error);
        alert('Error al eliminar la categoría');
      }
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    setFormLoading(true);
    setError('');

    try {
      const newCategory = await categoryService.create(formData);
      setCategories([...categories, newCategory]);
      setFormData({ name: '', description: '' });
      setShowCreateForm(false);
      alert('Categoría creada correctamente');
    } catch (error) {
      console.error('Error creando categoría:', error);
      const errorMessage = error.response?.data?.message ||
        'Error al crear la categoría';
      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  // Obtener color para la categoría
  const getCategoryColor = (index) => {
    return categoryColors[index % categoryColors.length];
  };

  // Obtener emoji para la categoría basado en el nombre
  const getCategoryEmoji = (name) => {
    const emojiMap = {
      'pintura': '🎨',
      'fotografía': '📸',
      'digital': '💻',
      'tradicional': '✏️',
      'ilustración': '🖼️',
      'diseño': '🎯',
      'escultura': '🗿',
      'arte': '🌟',
      'fotografia': '📸',
      'digital art': '💻',
      'painting': '🎨',
      'drawing': '✏️'
    };

    const lowerName = name.toLowerCase();
    for (const [keyword, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(keyword)) {
        return emoji;
      }
    }
    
    return '📂';
  };

  // Filtrar categorías
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="am-categories-loading-container">
        <div className="am-categories-spinner"></div>
        <p className="am-categories-loading-text">Cargando categorías...</p>
      </div>
    );
  }

  return (
    <div className="am-categories-container">
      {/* Encabezado */}
      <div className="am-categories-header">
        <div className="am-categories-header-content">
          <h1 className="am-categories-title">
            <span className="am-categories-title-icon">📂</span>
            Gestión de Categorías
          </h1>
          <p className="am-categories-subtitle">
            Organiza las <span className="am-categories-count">{categories.length}</span> categorías para clasificar las obras
          </p>
        </div>
        <div className="am-categories-header-decorations">
          <div className="am-categories-dot am-categories-dot-1"></div>
          <div className="am-categories-dot am-categories-dot-2"></div>
          <div className="am-categories-dot am-categories-dot-3"></div>
        </div>
      </div>

      {/* Panel de información */}
      <div className="am-categories-alert">
        <div className="am-categories-alert-icon">💡</div>
        <div className="am-categories-alert-content">
          <h3 className="am-categories-alert-title">Organización inteligente</h3>
          <p className="am-categories-alert-text">
            Las categorías ayudan a los usuarios a encontrar obras similares.
            <br />
            <span className="am-categories-alert-highlight">
              Crea categorías claras y descriptivas para mejor navegación.
            </span>
          </p>
        </div>
      </div>

      {/* Barra de búsqueda y acciones */}
      <div className="am-categories-toolbar">
        <div className="am-categories-search">
          <div className="am-categories-search-icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar categorías por nombre o descripción..."
            className="am-categories-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="am-categories-actions">
          <button 
            className="am-categories-refresh-btn"
            onClick={loadCategories}
          >
            <span className="am-categories-refresh-icon">🔄</span>
            Actualizar
          </button>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="am-categories-create-btn"
          >
            <span className="am-categories-create-icon">➕</span>
            Nueva Categoría
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="am-categories-stats-grid">
        <div className="am-categories-stat-card am-categories-stat-total">
          <div className="am-categories-stat-icon">📂</div>
          <div className="am-categories-stat-content">
            <h3 className="am-categories-stat-number">{categories.length}</h3>
            <p className="am-categories-stat-label">Total Categorías</p>
          </div>
        </div>

        <div className="am-categories-stat-card am-categories-stat-active">
          <div className="am-categories-stat-icon">✅</div>
          <div className="am-categories-stat-content">
            <h3 className="am-categories-stat-number">{categories.length}</h3>
            <p className="am-categories-stat-label">Activas</p>
          </div>
        </div>

        <div className="am-categories-stat-card am-categories-stat-empty">
          <div className="am-categories-stat-icon">📝</div>
          <div className="am-categories-stat-content">
            <h3 className="am-categories-stat-number">
              {categories.filter(cat => !cat.description).length}
            </h3>
            <p className="am-categories-stat-label">Sin descripción</p>
          </div>
        </div>
      </div>

      {/* Grid de categorías */}
      <div className="am-categories-grid-container">
        <div className="am-categories-grid-header">
          <h2 className="am-categories-grid-title">
            <span className="am-categories-grid-title-icon">🗂️</span>
            Todas las Categorías
            <span className="am-categories-grid-count">({filteredCategories.length})</span>
          </h2>
          <div className="am-categories-grid-summary">
            {filteredCategories.length === categories.length 
              ? `Mostrando todas las ${categories.length} categorías`
              : `Mostrando ${filteredCategories.length} de ${categories.length} categorías`
            }
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="am-categories-empty-state">
            <div className="am-categories-empty-icon">📂</div>
            <h3 className="am-categories-empty-title">
              {searchTerm ? 'No se encontraron categorías' : 'No hay categorías'}
            </h3>
            <p className="am-categories-empty-text">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando la primera categoría'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="am-categories-empty-btn"
              >
                <span className="am-categories-empty-btn-icon">➕</span>
                Crear Primera Categoría
              </button>
            )}
          </div>
        ) : (
          <div className="am-categories-grid">
            {filteredCategories.map((category, index) => (
              <div 
                key={category.id_categoria} 
                className="am-category-card"
                style={{ '--category-color': getCategoryColor(index) }}
              >
                {/* Header de la categoría */}
                <div className="am-category-header">
                  <div 
                    className="am-category-icon"
                    style={{ background: getCategoryColor(index) }}
                  >
                    <span className="am-category-emoji">
                      {getCategoryEmoji(category.name)}
                    </span>
                  </div>
                  <div className="am-category-title-container">
                    <h3 className="am-category-title" title={category.name}>
                      {category.name}
                    </h3>
                    <span className="am-category-id">ID: {category.id_categoria}</span>
                  </div>
                </div>

                {/* Descripción */}
                <div className="am-category-content">
                  <p className="am-category-description">
                    {category.description || (
                      <span className="am-category-no-description">
                        Sin descripción
                      </span>
                    )}
                  </p>
                </div>

                {/* Acciones */}
                <div className="am-category-actions">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="am-category-action-btn am-category-action-edit"
                  >
                    <span className="am-category-action-icon">✏️</span>
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDeleteCategory(category.id_categoria, category.name)}
                    className="am-category-action-btn am-category-action-delete"
                  >
                    <span className="am-category-action-icon">🗑️</span>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de creación */}
      {showCreateForm && (
        <div className="am-categories-modal-overlay">
          <div className="am-categories-modal am-categories-modal-create">
            <div className="am-categories-modal-header">
              <h3 className="am-categories-modal-title">
                <span className="am-categories-modal-icon">➕</span>
                Crear Nueva Categoría
              </h3>
              <button
                onClick={closeCreateModal}
                className="am-categories-modal-close"
                disabled={formLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="am-categories-modal-form">
              <div className="am-categories-modal-preview">
                <div 
                  className="am-categories-modal-preview-icon"
                  style={{ background: categoryColors[categories.length % categoryColors.length] }}
                >
                  <span className="am-categories-modal-preview-emoji">
                    {getCategoryEmoji(formData.name) || '📂'}
                  </span>
                </div>
                <div className="am-categories-modal-preview-info">
                  <span className="am-categories-modal-preview-name">
                    {formData.name || 'Nueva categoría'}
                  </span>
                  <span className="am-categories-modal-preview-id">
                    ID: Nuevo
                  </span>
                </div>
              </div>

              <div className="am-categories-modal-fields">
                <div className="am-categories-form-group">
                  <label className="am-categories-form-label">
                    <span className="am-categories-form-icon">🏷️</span>
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="am-categories-form-input"
                    required
                    disabled={formLoading}
                    placeholder="Ej: Pintura Digital, Fotografía, Ilustración..."
                    maxLength={100}
                    autoFocus
                  />
                  <div className="am-categories-form-hint">
                    {formData.name.length}/100 caracteres
                  </div>
                </div>

                <div className="am-categories-form-group">
                  <label className="am-categories-form-label">
                    <span className="am-categories-form-icon">📝</span>
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="am-categories-form-textarea"
                    rows={4}
                    disabled={formLoading}
                    placeholder="Describe esta categoría para ayudar a los usuarios a entender qué tipo de obras pertenecen aquí..."
                  />
                  <div className="am-categories-form-hint">
                    Opcional, pero recomendado para mejor organización
                  </div>
                </div>
              </div>

              {error && (
                <div className="am-categories-modal-error">
                  <span className="am-categories-modal-error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="am-categories-modal-actions">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="am-categories-modal-btn am-categories-modal-btn-cancel"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="am-categories-modal-btn am-categories-modal-btn-save"
                >
                  {formLoading ? (
                    <>
                      <span className="am-categories-modal-loading"></span>
                      Creando...
                    </>
                  ) : (
                    'Crear Categoría'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingCategory && (
        <div className="am-categories-modal-overlay">
          <div className="am-categories-modal am-categories-modal-edit">
            <div className="am-categories-modal-header">
              <h3 className="am-categories-modal-title">
                <span className="am-categories-modal-icon">✏️</span>
                Editar Categoría
              </h3>
              <button
                onClick={closeEditModal}
                className="am-categories-modal-close"
                disabled={formLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="am-categories-modal-form">
              <div className="am-categories-modal-preview">
                <div 
                  className="am-categories-modal-preview-icon"
                  style={{ background: getCategoryColor(categories.findIndex(c => c.id_categoria === editingCategory.id_categoria)) }}
                >
                  <span className="am-categories-modal-preview-emoji">
                    {getCategoryEmoji(editingCategory.name)}
                  </span>
                </div>
                <div className="am-categories-modal-preview-info">
                  <span className="am-categories-modal-preview-name">
                    {editingCategory.name}
                  </span>
                  <span className="am-categories-modal-preview-id">
                    ID: {editingCategory.id_categoria}
                  </span>
                </div>
              </div>

              <div className="am-categories-modal-fields">
                <div className="am-categories-form-group">
                  <label className="am-categories-form-label">
                    <span className="am-categories-form-icon">🏷️</span>
                    Nombre de la Categoría *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="am-categories-form-input"
                    required
                    disabled={formLoading}
                    maxLength={100}
                  />
                  <div className="am-categories-form-hint">
                    {formData.name.length}/100 caracteres
                  </div>
                </div>

                <div className="am-categories-form-group">
                  <label className="am-categories-form-label">
                    <span className="am-categories-form-icon">📝</span>
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="am-categories-form-textarea"
                    rows={4}
                    disabled={formLoading}
                  />
                </div>
              </div>

              {error && (
                <div className="am-categories-modal-error">
                  <span className="am-categories-modal-error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="am-categories-modal-actions">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="am-categories-modal-btn am-categories-modal-btn-cancel"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="am-categories-modal-btn am-categories-modal-btn-save"
                >
                  {formLoading ? (
                    <>
                      <span className="am-categories-modal-loading"></span>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Categoría'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;