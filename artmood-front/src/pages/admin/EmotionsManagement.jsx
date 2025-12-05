import React, { useState, useEffect } from 'react';
import { emotionService } from '../../services/emotionService';
import './EmotionsManagement.css';

const EmotionsManagement = () => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEmotion, setEditingEmotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    icon: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Emojis sugeridos organizados por categorías
  const emojiCategories = [
    {
      name: 'Positivas',
      emojis: ['😊', '😍', '🥰', '😎', '😄', '🤩', '✨', '🌈', '⭐', '❤️']
    },
    {
      name: 'Negativas',
      emojis: ['😢', '😠', '😔', '😰', '😭', '😤', '💔', '☔', '🌧️', '🔥']
    },
    {
      name: 'Neutrales',
      emojis: ['😐', '🤔', '😴', '😶', '🧐', '🤨', '😑', '🌙', '☁️', '🌊']
    },
    {
      name: 'Arte',
      emojis: ['🎨', '🎭', '🎼', '🎬', '📷', '🎪', '🎤', '🎸', '🎻', '🖌️']
    }
  ];

  // Todos los emojis en una sola lista para búsqueda
  const allEmojis = emojiCategories.flatMap(category => category.emojis);

  // Colores para las emociones
  const emotionColors = [
    'linear-gradient(135deg, #ff6b6b, #ee5a24)',
    'linear-gradient(135deg, #ff9f43, #ff9f1a)',
    'linear-gradient(135deg, #feca57, #ff9f43)',
    'linear-gradient(135deg, #48dbfb, #0abde3)',
    'linear-gradient(135deg, #1dd1a1, #10ac84)',
    'linear-gradient(135deg, #54a0ff, #2e86de)',
    'linear-gradient(135deg, #5f27cd, #341f97)',
    'linear-gradient(135deg, #ff9ff3, #f368e0)',
    'linear-gradient(135deg, #00d2d3, #01a3a4)',
    'linear-gradient(135deg, #ffd166, #ffb142)'
  ];

  useEffect(() => {
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      setLoading(true);
      const emotionsData = await emotionService.getAll();
      setEmotions(emotionsData);
    } catch (error) {
      console.error('Error cargando emociones:', error);
      setError('Error al cargar las emociones');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmotion = async (emotionId, emotionName) => {
    if (window.confirm(`¿Estás seguro de eliminar la emoción "${emotionName}"?`)) {
      try {
        await emotionService.delete(emotionId);
        setEmotions(emotions.filter(emotion => emotion.id_emocion !== emotionId));
        alert('Emoción eliminada correctamente');
      } catch (error) {
        console.error('Error eliminando emoción:', error);
        alert('Error al eliminar la emoción');
      }
    }
  };

  const handleEditEmotion = (emotion) => {
    setEditingEmotion(emotion);
    setFormData({
      name: emotion.name,
      icon: emotion.icon
    });
  };

  const handleCreateEmotion = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre de la emoción es obligatorio');
      return;
    }

    if (!formData.icon.trim()) {
      setError('Debes seleccionar un emoji');
      return;
    }

    setFormLoading(true);
    setError('');

    try {
      const newEmotion = await emotionService.create(formData);
      setEmotions([...emotions, newEmotion]);
      setFormData({ name: '', icon: '' });
      setShowCreateForm(false);
      alert('Emoción creada correctamente');
    } catch (error) {
      console.error('Error creando emoción:', error);
      const errorMessage = error.response?.data?.message || 
                          'Error al crear la emoción';
      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateEmotion = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre de la emoción es obligatorio');
      return;
    }

    if (!formData.icon.trim()) {
      setError('Debes seleccionar un emoji');
      return;
    }

    setFormLoading(true);
    setError('');

    try {
      const updatedEmotion = await emotionService.update(editingEmotion.id_emocion, formData);
      
      // Actualizar la lista de emociones
      setEmotions(emotions.map(emotion => 
        emotion.id_emocion === editingEmotion.id_emocion 
          ? { ...emotion, ...updatedEmotion } 
          : emotion
      ));
      
      closeEditModal();
      alert('Emoción actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando emoción:', error);
      const errorMessage = error.response?.data?.message || 
                          'Error al actualizar la emoción';
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

  const handleEmojiSelect = (emoji) => {
    setFormData(prev => ({
      ...prev,
      icon: emoji
    }));
  };

  const closeEditModal = () => {
    setEditingEmotion(null);
    setFormData({ name: '', icon: '' });
    setError('');
  };

  const closeCreateModal = () => {
    setShowCreateForm(false);
    setFormData({ name: '', icon: '' });
    setError('');
  };

  // Obtener color para la emoción
  const getEmotionColor = (index) => {
    return emotionColors[index % emotionColors.length];
  };

  // Filtrar emociones
  const filteredEmotions = emotions.filter(emotion =>
    emotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emotion.icon.includes(searchTerm)
  );

  // Obtener emojis filtrados por búsqueda
  const getFilteredEmojis = () => {
    if (!formData.name) return allEmojis;
    
    const lowerName = formData.name.toLowerCase();
    const moodKeywords = {
      'feliz': ['😊', '😄', '😍', '🥰', '😎', '🤩', '✨', '🌈', '❤️'],
      'triste': ['😢', '😔', '😭', '💔', '☔', '🌧️'],
      'enojado': ['😠', '😤', '🔥', '💢'],
      'amor': ['❤️', '🥰', '😍', '💘', '💝'],
      'arte': ['🎨', '🎭', '🎼', '🖌️', '🎬'],
      'inspiración': ['✨', '💡', '🌟', '🌈'],
      'calma': ['😌', '☮️', '🕊️', '🌊', '🌸'],
      'energía': ['⚡', '💪', '🔥', '🚀']
    };

    for (const [keyword, emojis] of Object.entries(moodKeywords)) {
      if (lowerName.includes(keyword)) {
        return emojis;
      }
    }
    
    return allEmojis;
  };

  if (loading) {
    return (
      <div className="am-emotions-loading-container">
        <div className="am-emotions-spinner"></div>
        <p className="am-emotions-loading-text">Cargando emociones...</p>
      </div>
    );
  }

  return (
    <div className="am-emotions-container">
      {/* Encabezado */}
      <div className="am-emotions-header">
        <div className="am-emotions-header-content">
          <h1 className="am-emotions-title">
            <span className="am-emotions-title-icon">😊</span>
            Gestión de Emociones
          </h1>
          <p className="am-emotions-subtitle">
            Define las <span className="am-emotions-count">{emotions.length}</span> emociones que pueden expresar las obras de arte
          </p>
        </div>
        <div className="am-emotions-header-decorations">
          <div className="am-emotions-dot am-emotions-dot-1"></div>
          <div className="am-emotions-dot am-emotions-dot-2"></div>
          <div className="am-emotions-dot am-emotions-dot-3"></div>
        </div>
      </div>

      {/* Panel de información */}
      <div className="am-emotions-alert">
        <div className="am-emotions-alert-icon">🎭</div>
        <div className="am-emotions-alert-content">
          <h3 className="am-emotions-alert-title">El lenguaje de las emociones</h3>
          <p className="am-emotions-alert-text">
            Las emociones ayudan a los artistas a expresar lo inexpresable.
            <br />
            <span className="am-emotions-alert-highlight">
              Elige emojis que realmente capturen la esencia de cada emoción.
            </span>
          </p>
        </div>
      </div>

      {/* Barra de búsqueda y acciones */}
      <div className="am-emotions-toolbar">
        <div className="am-emotions-search">
          <div className="am-emotions-search-icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar emociones por nombre o emoji..."
            className="am-emotions-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="am-emotions-actions">
          <button 
            className="am-emotions-refresh-btn"
            onClick={loadEmotions}
          >
            <span className="am-emotions-refresh-icon">🔄</span>
            Actualizar
          </button>
          
          <button
            onClick={() => setShowCreateForm(true)}
            className="am-emotions-create-btn"
          >
            <span className="am-emotions-create-icon">➕</span>
            Nueva Emoción
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="am-emotions-stats-grid">
        <div className="am-emotions-stat-card am-emotions-stat-total">
          <div className="am-emotions-stat-icon">😊</div>
          <div className="am-emotions-stat-content">
            <h3 className="am-emotions-stat-number">{emotions.length}</h3>
            <p className="am-emotions-stat-label">Total Emociones</p>
          </div>
        </div>

        <div className="am-emotions-stat-card am-emotions-stat-positive">
          <div className="am-emotions-stat-icon">⭐</div>
          <div className="am-emotions-stat-content">
            <h3 className="am-emotions-stat-number">
              {emotions.filter(e => ['😊', '😍', '🥰', '😎', '🤩', '✨', '🌈', '⭐', '❤️'].includes(e.icon)).length}
            </h3>
            <p className="am-emotions-stat-label">Positivas</p>
          </div>
        </div>

        <div className="am-emotions-stat-card am-emotions-stat-unique">
          <div className="am-emotions-stat-icon">🎨</div>
          <div className="am-emotions-stat-content">
            <h3 className="am-emotions-stat-number">
              {new Set(emotions.map(e => e.icon)).size}
            </h3>
            <p className="am-emotions-stat-label">Emojis Únicos</p>
          </div>
        </div>
      </div>

      {/* Grid de emociones */}
      <div className="am-emotions-grid-container">
        <div className="am-emotions-grid-header">
          <h2 className="am-emotions-grid-title">
            <span className="am-emotions-grid-title-icon">💫</span>
            Galería de Emociones
            <span className="am-emotions-grid-count">({filteredEmotions.length})</span>
          </h2>
          <div className="am-emotions-grid-summary">
            {filteredEmotions.length === emotions.length 
              ? `Mostrando todas las ${emotions.length} emociones`
              : `Mostrando ${filteredEmotions.length} de ${emotions.length} emociones`
            }
          </div>
        </div>

        {filteredEmotions.length === 0 ? (
          <div className="am-emotions-empty-state">
            <div className="am-emotions-empty-icon">🎭</div>
            <h3 className="am-emotions-empty-title">
              {searchTerm ? 'No se encontraron emociones' : 'No hay emociones'}
            </h3>
            <p className="am-emotions-empty-text">
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza creando la primera emoción'
              }
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="am-emotions-empty-btn"
              >
                <span className="am-emotions-empty-btn-icon">➕</span>
                Crear Primera Emoción
              </button>
            )}
          </div>
        ) : (
          <div className="am-emotions-grid">
            {filteredEmotions.map((emotion, index) => (
              <div 
                key={emotion.id_emocion} 
                className="am-emotion-card"
                style={{ '--emotion-color': getEmotionColor(index) }}
              >
                {/* Emoji grande */}
                <div className="am-emotion-emoji-container">
                  <div 
                    className="am-emotion-emoji-bg"
                    style={{ background: getEmotionColor(index) }}
                  >
                    <span className="am-emotion-emoji">{emotion.icon}</span>
                  </div>
                  <div className="am-emotion-sparkle am-emotion-sparkle-1">✨</div>
                  <div className="am-emotion-sparkle am-emotion-sparkle-2">🌟</div>
                  <div className="am-emotion-sparkle am-emotion-sparkle-3">⭐</div>
                </div>

                {/* Información */}
                <div className="am-emotion-content">
                  <h3 className="am-emotion-name" title={emotion.name}>
                    {emotion.name}
                  </h3>
                  <div className="am-emotion-id">ID: {emotion.id_emocion}</div>
                </div>

                {/* Acciones */}
                <div className="am-emotion-actions">
                  <button
                    onClick={() => handleEditEmotion(emotion)}
                    className="am-emotion-action-btn am-emotion-action-edit"
                  >
                    <span className="am-emotion-action-icon">✏️</span>
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDeleteEmotion(emotion.id_emocion, emotion.name)}
                    className="am-emotion-action-btn am-emotion-action-delete"
                  >
                    <span className="am-emotion-action-icon">🗑️</span>
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
        <div className="am-emotions-modal-overlay">
          <div className="am-emotions-modal am-emotions-modal-create">
            <div className="am-emotions-modal-header">
              <h3 className="am-emotions-modal-title">
                <span className="am-emotions-modal-icon">➕</span>
                Crear Nueva Emoción
              </h3>
              <button
                onClick={closeCreateModal}
                className="am-emotions-modal-close"
                disabled={formLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmotion} className="am-emotions-modal-form">
              {/* Vista previa */}
              <div className="am-emotions-modal-preview">
                <div 
                  className="am-emotions-modal-preview-emoji"
                  style={{ 
                    background: emotionColors[emotions.length % emotionColors.length],
                    opacity: formData.icon ? 1 : 0.5
                  }}
                >
                  <span className="am-emotions-modal-preview-icon">
                    {formData.icon || '😊'}
                  </span>
                </div>
                <div className="am-emotions-modal-preview-info">
                  <span className="am-emotions-modal-preview-name">
                    {formData.name || 'Nueva Emoción'}
                  </span>
                  <span className="am-emotions-modal-preview-id">
                    Vista previa
                  </span>
                </div>
              </div>

              <div className="am-emotions-modal-fields">
                <div className="am-emotions-form-group">
                  <label className="am-emotions-form-label">
                    <span className="am-emotions-form-icon">🏷️</span>
                    Nombre de la Emoción *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="am-emotions-form-input"
                    required
                    disabled={formLoading}
                    placeholder="Ej: Felicidad, Tristeza, Inspiración, Éxtasis..."
                    maxLength={50}
                    autoFocus
                  />
                  <div className="am-emotions-form-hint">
                    {formData.name.length}/50 caracteres
                  </div>
                </div>

                <div className="am-emotions-form-group">
                  <label className="am-emotions-form-label">
                    <span className="am-emotions-form-icon">🎭</span>
                    Seleccionar Emoji *
                  </label>
                  
                  {/* Emoji seleccionado */}
                  {formData.icon && (
                    <div className="am-emotions-selected-emoji">
                      <div className="am-emotions-selected-emoji-display">
                        <span className="am-emotions-selected-emoji-icon">{formData.icon}</span>
                      </div>
                      <span className="am-emotions-selected-emoji-label">Emoji seleccionado</span>
                    </div>
                  )}

                  {/* Grid de emojis categorizados */}
                  <div className="am-emotions-emoji-picker">
                    {emojiCategories.map((category, catIndex) => (
                      <div key={catIndex} className="am-emotions-emoji-category">
                        <h4 className="am-emotions-emoji-category-title">
                          {category.name}
                        </h4>
                        <div className="am-emotions-emoji-grid">
                          {category.emojis.map((emoji, emojiIndex) => (
                            <button
                              key={emojiIndex}
                              type="button"
                              onClick={() => handleEmojiSelect(emoji)}
                              className={`am-emotions-emoji-btn ${
                                formData.icon === emoji ? 'am-emotions-emoji-btn-selected' : ''
                              }`}
                              title={`Click para seleccionar ${emoji}`}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input personalizado para emoji */}
                  <div className="am-emotions-custom-emoji">
                    <label className="am-emotions-custom-emoji-label">
                      <span className="am-emotions-custom-emoji-icon">⌨️</span>
                      O escribe cualquier emoji:
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={handleInputChange}
                      name="icon"
                      placeholder="Escribe o pega un emoji aquí..."
                      className="am-emotions-custom-emoji-input"
                      maxLength={10}
                      disabled={formLoading}
                    />
                    <div className="am-emotions-emoji-help">
                      <span className="am-emotions-emoji-help-icon">💡</span>
                      Puedes usar emojis de tu teclado (Windows: ⊞ Win + . | Mac: ⌃ Ctrl + ⌘ Cmd + Space)
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="am-emotions-modal-error">
                  <span className="am-emotions-modal-error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="am-emotions-modal-actions">
                <button
                  type="button"
                  onClick={closeCreateModal}
                  className="am-emotions-modal-btn am-emotions-modal-btn-cancel"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading || !formData.icon}
                  className="am-emotions-modal-btn am-emotions-modal-btn-save"
                >
                  {formLoading ? (
                    <>
                      <span className="am-emotions-modal-loading"></span>
                      Creando...
                    </>
                  ) : (
                    'Crear Emoción'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingEmotion && (
        <div className="am-emotions-modal-overlay">
          <div className="am-emotions-modal am-emotions-modal-edit">
            <div className="am-emotions-modal-header">
              <h3 className="am-emotions-modal-title">
                <span className="am-emotions-modal-icon">✏️</span>
                Editar Emoción
              </h3>
              <button
                onClick={closeEditModal}
                className="am-emotions-modal-close"
                disabled={formLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateEmotion} className="am-emotions-modal-form">
              {/* Vista previa */}
              <div className="am-emotions-modal-preview">
                <div 
                  className="am-emotions-modal-preview-emoji"
                  style={{ 
                    background: getEmotionColor(emotions.findIndex(e => e.id_emocion === editingEmotion.id_emocion))
                  }}
                >
                  <span className="am-emotions-modal-preview-icon">
                    {formData.icon}
                  </span>
                </div>
                <div className="am-emotions-modal-preview-info">
                  <span className="am-emotions-modal-preview-name">
                    {editingEmotion.name}
                  </span>
                  <span className="am-emotions-modal-preview-id">
                    ID: {editingEmotion.id_emocion}
                  </span>
                </div>
              </div>

              <div className="am-emotions-modal-fields">
                <div className="am-emotions-form-group">
                  <label className="am-emotions-form-label">
                    <span className="am-emotions-form-icon">🏷️</span>
                    Nombre de la Emoción *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="am-emotions-form-input"
                    required
                    disabled={formLoading}
                    maxLength={50}
                  />
                  <div className="am-emotions-form-hint">
                    {formData.name.length}/50 caracteres
                  </div>
                </div>

                <div className="am-emotions-form-group">
                  <label className="am-emotions-form-label">
                    <span className="am-emotions-form-icon">🎭</span>
                    Seleccionar Emoji *
                  </label>
                  
                  {/* Emoji seleccionado */}
                  {formData.icon && (
                    <div className="am-emotions-selected-emoji">
                      <div className="am-emotions-selected-emoji-display">
                        <span className="am-emotions-selected-emoji-icon">{formData.icon}</span>
                      </div>
                      <span className="am-emotions-selected-emoji-label">Emoji seleccionado</span>
                    </div>
                  )}

                  {/* Emojis sugeridos basados en el nombre */}
                  <div className="am-emotions-suggested-emojis">
                    <h4 className="am-emotions-suggested-title">
                      Sugerencias para "{formData.name}"
                    </h4>
                    <div className="am-emotions-emoji-grid">
                      {getFilteredEmojis().map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                          className={`am-emotions-emoji-btn ${
                            formData.icon === emoji ? 'am-emotions-emoji-btn-selected' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input personalizado para emoji */}
                  <div className="am-emotions-custom-emoji">
                    <label className="am-emotions-custom-emoji-label">
                      <span className="am-emotions-custom-emoji-icon">⌨️</span>
                      Emoji personalizado:
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="Escribe o pega un emoji aquí..."
                      className="am-emotions-custom-emoji-input"
                      maxLength={10}
                      disabled={formLoading}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="am-emotions-modal-error">
                  <span className="am-emotions-modal-error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="am-emotions-modal-actions">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="am-emotions-modal-btn am-emotions-modal-btn-cancel"
                  disabled={formLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formLoading || !formData.icon}
                  className="am-emotions-modal-btn am-emotions-modal-btn-save"
                >
                  {formLoading ? (
                    <>
                      <span className="am-emotions-modal-loading"></span>
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Emoción'
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

export default EmotionsManagement;