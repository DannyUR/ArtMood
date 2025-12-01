// components/modals/EditObraModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';
import { emotionService } from '../../services/emotionService';
import './EditObraModal.css';

const EditObraModal = ({ isOpen, onClose, obraId, onSuccess }) => {
    const { user } = useAuth();
    
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
        if (isOpen && obraId) {
            loadObraData();
        } else {
            // Resetear cuando se cierra
            resetForm();
        }
    }, [isOpen, obraId]);

    const resetForm = () => {
        setObra(null);
        setFormData({
            title: '',
            description: '',
            id_categoria: '',
            id_emocion: '',
            image: null
        });
        setPreviewUrl('');
        setError('');
        setLoading(true);
    };

    const loadObraData = async () => {
        try {
            setLoading(true);

            const [obraData, categoriasData, emocionesData] = await Promise.all([
                obraService.getById(obraId),
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

                response = await obraService.update(obraId, formDataToSend);
            } else {
                const updateData = {
                    title: formData.title,
                    description: formData.description,
                    id_categoria: formData.id_categoria || null,
                    id_emocion: formData.id_emocion || null
                };

                response = await obraService.update(obraId, updateData);
            }

            alert('¡Obra actualizada exitosamente!');
            onSuccess?.();
            onClose();

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
        setPreviewUrl(obra?.imagen ? `http://localhost:8000/storage/${obra.imagen}` : '');
    };

    const cancelEdit = () => {
        if (formData.title !== obra?.title || 
            formData.description !== obra?.description || 
            formData.id_categoria !== obra?.id_categoria || 
            formData.id_emocion !== obra?.id_emocion || 
            formData.image) {
            if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
                onClose();
            }
        } else {
            onClose();
        }
    };

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content loading-modal">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Cargando obra...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={(e) => e.target.className === 'modal-overlay' && cancelEdit()}>
            <div className="modal-content edit-obra-modal">
                {/* Header del Modal */}
                <div className="modal-header">
                    <div className="header-content">
                        <h2 className="modal-title">Editar Obra</h2>
                        <p className="modal-subtitle">
                            Actualiza los detalles de "{obra?.title}"
                        </p>
                    </div>
                    <button onClick={cancelEdit} className="modal-close-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
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

                        {/* Action Buttons */}
                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="cancel-btn"
                                disabled={saving}
                            >
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
                                    'Guardar Cambios'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditObraModal;