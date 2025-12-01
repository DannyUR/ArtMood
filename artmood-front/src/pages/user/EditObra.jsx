import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';
import { emotionService } from '../../services/emotionService';
import './EditObra.css'; // Archivo CSS para los estilos

const EditObra = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [obra, setObra] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        id_categoria: '',
        id_emocion: '',
        image: null
    });

    const [categorias, setCategorias] = useState([]);
    const [emociones, setEmociones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadObraData();
    }, [id]);

    const loadObraData = async () => {
        try {
            setLoading(true);

            const [obraData, categoriasData, emocionesData] = await Promise.all([
                obraService.getById(id),
                categoryService.getAll(),
                emotionService.getAll()
            ]);

            const userId = user.id_usuario || user.id;
            if (obraData.id_usuario !== userId) {
                setError('No tienes permisos para editar esta obra');
                return;
            }

            setObra(obraData);
            setFormData({
                title: obraData.title || '',
                description: obraData.description || '',
                id_categoria: obraData.id_categoria || '',
                id_emocion: obraData.id_emocion || '',
                image: null
            });

            setCategorias(categoriasData);
            setEmociones(emocionesData);

            if (obraData.imagen) {
                setPreviewUrl(`http://localhost:8000/storage/${obraData.imagen}`);
            }

        } catch (error) {
            console.error('Error cargando obra:', error);
            setError('Error al cargar la obra');
        } finally {
            setLoading(false);
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

        if (!formData.title.trim()) {
            setError('El título es obligatorio');
            return;
        }

        setSaving(true);
        setError('');

        try {
            let response;

            if (formData.image) {
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('_method', 'PUT');

                if (formData.id_categoria) {
                    formDataToSend.append('id_categoria', formData.id_categoria);
                } else {
                    formDataToSend.append('id_categoria', '');
                }

                if (formData.id_emocion) {
                    formDataToSend.append('id_emocion', formData.id_emocion);
                } else {
                    formDataToSend.append('id_emocion', '');
                }

                formDataToSend.append('image', formData.image);

                response = await obraService.update(id, formDataToSend);
            } else {
                const updateData = {
                    title: formData.title,
                    description: formData.description,
                    id_categoria: formData.id_categoria || null,
                    id_emocion: formData.id_emocion || null
                };

                response = await obraService.update(id, updateData);
            }

            alert('¡Obra actualizada exitosamente!');
            navigate('/user/my-obras');

        } catch (error) {
            console.error('Error actualizando obra:', error);

            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat().join(', ');
                setError(`Errores de validación: ${errorMessages}`);
            } else {
                const errorMessage = error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Error al actualizar la obra';
                setError(errorMessage);
            }
        } finally {
            setSaving(false);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setPreviewUrl(obra.imagen ? `http://localhost:8000/storage/${obra.imagen}` : '');
    };

    const cancelEdit = () => {
        if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
            navigate('/user/my-obras');
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Cargando obra...</p>
            </div>
        );
    }

    if (error && !obra) {
        return (
            <div className="edit-obra-container">
                <div className="error-message">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <div>
                        <strong>Error:</strong> {error}
                    </div>
                </div>
                <button
                    onClick={() => navigate('/user/my-obras')}
                    className="back-btn"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Volver a Mis Obras
                </button>
            </div>
        );
    }

    return (
        <div className="edit-obra-container">
            {/* Header Section */}
            <div className="edit-obra-header">
                <div className="header-content">
                    <h1 className="page-title">Editar Obra</h1>
                    <p className="page-subtitle">
                        Actualiza los detalles de "{obra?.title}"
                    </p>
                </div>
                <div className="edit-steps">
                    <div className="step active">
                        <span className="step-number">1</span>
                        <span className="step-text">Editar obra</span>
                    </div>
                    <div className="step">
                        <span className="step-number">2</span>
                        <span className="step-text">Guardar cambios</span>
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

                <form onSubmit={handleSubmit} className="edit-form">
                    {/* Image Section */}
                    <div className="form-section">
                        <label className="section-label">
                            Cambiar Imagen (opcional)
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
                                        title="Restaurar imagen original"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </button>
                                </div>
                                <p className="preview-text">
                                    {formData.image ? 'Nueva imagen seleccionada' : 'Imagen actual'}
                                </p>
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
                                    <div className="upload-icon">🔄</div>
                                    <div className="upload-text">
                                        <p className="upload-main-text">Seleccionar nueva imagen</p>
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
                            disabled={saving}
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
                            disabled={saving}
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
                                disabled={saving}
                            >
                                <option value="">Sin categoría</option>
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
                                disabled={saving}
                            >
                                <option value="">Sin emoción</option>
                                {emociones.map(emocion => (
                                    <option key={emocion.id_emocion} value={emocion.id_emocion}>
                                        {emocion.icon} {emocion.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Obra Information */}
                    <div className="obra-info">
                        <h3 className="info-label">Información de la obra</h3>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label-small">ID:</span>
                                <span className="info-value">{obra?.id_obra}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label-small">Publicada:</span>
                                <span className="info-value">
                                    {obra && new Date(obra.fecha_publicacion).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="info-item">
                                <span className="info-label-small">Artista:</span>
                                <span className="info-value">{user?.name}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label-small">Usuario:</span>
                                <span className="info-value">@{user?.nickname}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="action-buttons">
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="cancel-btn"
                            disabled={saving}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="submit-btn"
                        >
                            {saving ? (
                                <div className="loading-content">
                                    <div className="loading-spinner-small"></div>
                                    Guardando...
                                </div>
                            ) : (
                                <>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2"/>
                                    </svg>
                                    Guardar Cambios
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
                    <h3 className="help-title">Consejos para editar tu obra</h3>
                    <ul className="help-list">
                        <li>Puedes cambiar la imagen manteniendo la calidad original</li>
                        <li>Actualiza el título y descripción para mejorar la visibilidad</li>
                        <li>Revisa que las categorías y emociones sean las correctas</li>
                        <li>Los cambios se reflejarán inmediatamente en la galería</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default EditObra;