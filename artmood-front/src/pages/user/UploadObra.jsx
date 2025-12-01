import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';
import { emotionService } from '../../services/emotionService';
import './UploadObra.css'; // Archivo CSS para los estilos

const UploadObra = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    id_categoria: '',
    id_emocion: '',
    image: null
  });

  const [categorias, setCategorias] = useState([]);
  const [emociones, setEmociones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      const [categoriasData, emocionesData] = await Promise.all([
        categoryService.getAll(),
        emotionService.getAll()
      ]);

      setCategorias(categoriasData);
      setEmociones(emocionesData);
    } catch (error) {
      console.error('Error cargando datos del formulario:', error);
      setError('Error al cargar categorías y emociones');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona un archivo de imagen válido');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Usuario completo:', user);
    console.log('ID del usuario:', user?.id, user?.id_usuario);

    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!formData.image) {
      setError('Debes seleccionar una imagen');
      return;
    }

    if (!user || (!user.id && !user.id_usuario)) {
      setError('No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = user.id_usuario || user.id;

      console.log('ID de usuario a enviar:', userId);

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('id_usuario', userId.toString());

      if (formData.id_categoria) {
        formDataToSend.append('id_categoria', formData.id_categoria);
      }

      if (formData.id_emocion) {
        formDataToSend.append('id_emocion', formData.id_emocion);
      }

      console.log('Archivo de imagen:', formData.image);
      formDataToSend.append('image', formData.image);

      console.log('FormData contenido:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      console.log('Enviando datos:', {
        title: formData.title,
        id_usuario: userId,
        image: formData.image.name
      });

      const response = await obraService.create(formDataToSend);

      alert('¡Obra publicada exitosamente!');
      navigate('/user');

    } catch (error) {
      console.error('Error creando obra:', error);

      if (error.response?.status === 422) {
        const validationErrors = error.response.data?.errors || error.response.data;
        let errorMessages = '';

        if (typeof validationErrors === 'object') {
          errorMessages = Object.values(validationErrors).flat().join(', ');
        } else if (typeof validationErrors === 'string') {
          errorMessages = validationErrors;
        } else {
          errorMessages = 'Error de validación desconocido';
        }

        setError(`Errores de validación: ${errorMessages}`);
      } else if (error.response?.status === 500) {
        setError('Error del servidor: ' + (error.response.data?.message || 'Revisa los logs'));
      } else {
        const errorMessage = error.response?.data?.message ||
          error.response?.data?.error ||
          'Error al publicar la obra';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setPreviewUrl('');
  };

  return (
    <div className="upload-obra-container">
      {/* Header */}
      <div className="upload-header">
        <div className="header-content">
          <h1 className="upload-title">
            Publicar Nueva Obra
          </h1>
          <p className="upload-subtitle">
            Comparte tu arte con la comunidad ArtMood
          </p>
        </div>
        <div className="upload-steps">
          <div className="step active">
            <span className="step-number">1</span>
            <span className="step-text">Subir obra</span>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <span className="step-text">Compartir</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="form-container">
        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          {/* Image Upload Section */}
          <div className="form-section">
            <label className="section-label">
              Imagen de la Obra *
            </label>
            
            {previewUrl ? (
              <div className="image-preview-container">
                <div className="image-preview">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="preview-image"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="remove-image-btn"
                    title="Eliminar imagen"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                </div>
                <p className="preview-text">Vista previa de tu obra</p>
              </div>
            ) : (
              <div className="image-upload-area">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-input"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="upload-label">
                  <div className="upload-icon">🖼️</div>
                  <div className="upload-text">
                    <p className="upload-main-text">Seleccionar imagen</p>
                    <p className="upload-sub-text">PNG, JPG, JPEG hasta 5MB</p>
                  </div>
                </label>
              </div>
            )}
          </div>

          {/* Title Field */}
          <div className="form-section">
            <label htmlFor="title" className="section-label">
              Título de la Obra *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: Atardecer en la montaña"
              className="form-input"
              maxLength={150}
              disabled={loading}
            />
            <div className="char-counter">
              {formData.title.length}/150 caracteres
            </div>
          </div>

          {/* Description Field */}
          <div className="form-section">
            <label htmlFor="description" className="section-label">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe tu obra, inspiración, técnica utilizada..."
              rows={4}
              className="form-textarea"
              disabled={loading}
            />
          </div>

          {/* Category and Emotion Selectors */}
          <div className="form-grid">
            <div className="form-section">
              <label htmlFor="id_categoria" className="section-label">
                Categoría
              </label>
              <select
                id="id_categoria"
                name="id_categoria"
                value={formData.id_categoria}
                onChange={handleInputChange}
                className="form-select"
                disabled={loading}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id_categoria} value={categoria.id_categoria}>
                    {categoria.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="id_emocion" className="section-label">
                Emoción
              </label>
              <select
                id="id_emocion"
                name="id_emocion"
                value={formData.id_emocion}
                onChange={handleInputChange}
                className="form-select"
                disabled={loading}
              >
                <option value="">Seleccionar emoción</option>
                {emociones.map(emocion => (
                  <option key={emocion.id_emocion} value={emocion.id_emocion}>
                    {emocion.icon} {emocion.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Artist Info */}
          <div className="artist-info">
            <h3 className="artist-label">Publicar como:</h3>
            <div className="artist-details">
              <div className="artist-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="artist-text">
                <p className="artist-name">{user?.name}</p>
                <p className="artist-handle">@{user?.nickname}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              type="button"
              onClick={() => navigate('/user')}
              className="cancel-btn"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <div className="loading-content">
                  <div className="loading-spinner"></div>
                  Publicando...
                </div>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Publicar Obra
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Information */}
      <div className="help-section">
        <div className="help-icon">💡</div>
        <div className="help-content">
          <h3 className="help-title">Consejos para una buena publicación</h3>
          <ul className="help-list">
            <li>Usa un título descriptivo y atractivo</li>
            <li>Selecciona una imagen de alta calidad</li>
            <li>Describe tu proceso creativo o inspiración</li>
            <li>Elige categorías y emociones que representen tu obra</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadObra;