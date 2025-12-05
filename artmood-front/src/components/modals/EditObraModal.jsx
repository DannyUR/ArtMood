// components/modals/EditObraModal.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';
import { emotionService } from '../../services/emotionService';
import './EditObraModal.css';

// Función helper MEJORADA para construir URLs de imágenes
const getImageUrl = (imagePath, imageUrlFromApi = null) => {
    console.log('🔍 getImageUrl llamado con:', { 
        imagePath, 
        imageUrlFromApi,
        esString: typeof imagePath === 'string',
        esStringApi: typeof imageUrlFromApi === 'string'
    });
    
    // PRIMERO: Verificar si la API devuelve image_url válido
    if (imageUrlFromApi && typeof imageUrlFromApi === 'string') {
        console.log('✅ Usando image_url de la API:', imageUrlFromApi);
        
        // Verificar si es una URL temporal incorrecta
        if (imageUrlFromApi.includes('\\tmp\\') || 
            imageUrlFromApi.includes('xampp') || 
            imageUrlFromApi.includes('C:\\')) {
            console.error('❌ URL temporal detectada en image_url:', imageUrlFromApi);
            return ''; // Retornar vacío para mostrar placeholder
        }
        
        // Verificar si es una URL válida
        if (imageUrlFromApi.startsWith('http://') || imageUrlFromApi.startsWith('https://')) {
            return imageUrlFromApi;
        }
        
        // Si no empieza con http, podría ser una ruta relativa
        console.warn('⚠️ image_url no es una URL completa:', imageUrlFromApi);
    }
    
    // SEGUNDO: Si no hay image_url o es inválido, usar imagePath
    if (!imagePath || typeof imagePath !== 'string') {
        console.log('📭 No hay imagePath válido');
        return '';
    }
    
    // DETECTAR RUTAS TEMPORALES
    if (imagePath.includes('\\tmp\\') || 
        imagePath.includes('php') || 
        imagePath.includes('xampp\\tmp') ||
        imagePath.includes('C:\\')) {
        console.error('❌ RUTA TEMPORAL DETECTADA (ERROR):', imagePath);
        return ''; // Retornar vacío para mostrar fallback
    }
    
    // Si ya es una URL completa
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // Si empieza con 'obras/' (ruta relativa correcta del storage)
    if (imagePath.startsWith('obras/')) {
        const url = `http://localhost:8000/storage/${imagePath}`;
        console.log('🔗 URL construida desde obras/:', url);
        return url;
    }
    
    // Si empieza con 'storage/' (ya incluye storage/)
    if (imagePath.startsWith('storage/')) {
        const url = `http://localhost:8000/${imagePath}`;
        console.log('🔗 URL construida desde storage/:', url);
        return url;
    }
    
    // Si empieza con '/' (ruta absoluta del servidor)
    if (imagePath.startsWith('/')) {
        const url = `http://localhost:8000${imagePath}`;
        console.log('🔗 URL construida desde ruta absoluta:', url);
        return url;
    }
    
    // Por defecto, asumir que es una ruta relativa en storage
    const url = `http://localhost:8000/storage/${imagePath}`;
    console.log('🔗 URL por defecto:', url);
    return url;
};

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
            resetForm();
        }
    }, [isOpen, obraId]);

    const resetForm = () => {
        console.log('🔄 Resetando formulario');
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
            console.log('📥 Cargando datos de obra ID:', obraId);

            const [obraData, categoriasData, emocionesData] = await Promise.all([
                obraService.getById(obraId),
                categoryService.getAll(),
                emotionService.getAll()
            ]);

            console.log('✅ Datos cargados:', {
                obra: obraData ? 'Sí' : 'No',
                categorias: categoriasData.length,
                emociones: emocionesData.length
            });

            console.log('📊 DEBUG - Datos completos de la obra:', obraData);
            console.log('🖼️ DEBUG - Información de imagen:', {
                tieneImage: !!obraData.image,
                valorImage: obraData.image,
                tipoImage: typeof obraData.image,
                tieneImageUrl: !!obraData.image_url,
                valorImageUrl: obraData.image_url,
                otrosCamposImagen: Object.keys(obraData).filter(k => 
                    k.includes('image') || k.includes('img') || k.includes('url')
                )
            });

            const userId = user.id_usuario || user.id;
            if (obraData.id_usuario !== userId) {
                console.error('⛔ Usuario no autorizado para editar esta obra');
                setError('No tienes permisos para editar esta obra');
                return;
            }

            setObra(obraData);
            setFormData({
                title: obraData.title || '',
                description: obraData.description || '',
                id_categoria: obraData.id_categoria || '',
                id_emocion: obraData.id_emocion || '',
                image: null // Siempre null al cargar, solo File cuando es nueva
            });

            setCategorias(categoriasData);
            setEmociones(emocionesData);

            // 🔴 CRÍTICO: Obtener URL de la imagen usando la función helper MEJORADA
            const imageUrl = getImageUrl(obraData.image, obraData.image_url);
            console.log('🔗 URL final calculada para imagen:', imageUrl);

            // Establecer preview solo si tenemos una URL válida (no temporal)
            if (imageUrl && 
                !imageUrl.includes('tmp') && 
                !imageUrl.includes('xampp') && 
                !imageUrl.includes('C:\\')) {
                
                console.log('✅ Estableciendo preview URL:', imageUrl);
                setPreviewUrl(imageUrl);
                
                // Verificar si la imagen realmente existe (async)
                const testImage = new Image();
                testImage.onload = () => {
                    console.log('✅ Imagen cargada exitosamente desde:', imageUrl);
                };
                testImage.onerror = () => {
                    console.error('❌ Error cargando imagen, URL puede ser incorrecta:', imageUrl);
                    // No limpiar preview aquí para no causar flickering
                };
                testImage.src = imageUrl;
            } else {
                console.log('⚠️ No hay imagen válida para mostrar o es ruta temporal');
                console.log('🧹 Limpiando preview URL');
                setPreviewUrl('');
            }

        } catch (error) {
            console.error('❌ Error cargando obra:', error);
            setError('Error al cargar la obra: ' + (error.message || 'Error desconocido'));
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
        if (!file) {
            console.log('📭 No se seleccionó archivo');
            return;
        }

        console.log('📁 Archivo seleccionado:', {
            nombre: file.name,
            tipo: file.type,
            tamaño: file.size + ' bytes',
            esImagen: file.type.startsWith('image/')
        });

        // Validar tipo MIME permitido
        const allowedTypes = [
            'image/jpeg', 
            'image/jpg', 
            'image/png', 
            'image/gif', 
            'image/webp'
        ];

        if (!allowedTypes.includes(file.type.toLowerCase())) {
            setError(`Tipo de archivo "${file.type}" no permitido. Use: PNG, JPG, JPEG, GIF, WEBP`);
            e.target.value = ''; // Limpiar input
            return;
        }

        // Validar tamaño (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
            setError(`La imagen es demasiado grande (${sizeMB}MB). Máximo: 5MB`);
            e.target.value = '';
            return;
        }

        setFormData(prev => ({
            ...prev,
            image: file
        }));

        // Crear preview local (Data URL)
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
            console.log('🖼️ Preview local creado exitosamente');
        };
        reader.onerror = (error) => {
            console.error('❌ Error leyendo archivo:', error);
            setError('Error al leer el archivo');
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('🚀 Iniciando envío del formulario');

        if (!formData.title.trim()) {
            setError('El título es obligatorio');
            return;
        }

        setSaving(true);
        setError('');

        try {
            let response;
            const isNewImage = formData.image && formData.image instanceof File;

            if (isNewImage) {
                console.log('🔄 Enviando obra con NUEVA imagen:', {
                    nombre: formData.image.name,
                    tipo: formData.image.type,
                    tamaño: formData.image.size
                });
                
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('_method', 'PUT'); // Para Laravel

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

                // Debug: Mostrar contenido del FormData
                console.log('📦 Contenido de FormData:');
                for (let pair of formDataToSend.entries()) {
                    console.log(`  ${pair[0]}: ${pair[1] instanceof File ? 
                        `File(${pair[1].name}, ${pair[1].type})` : 
                        pair[1]}`);
                }

                response = await obraService.update(obraId, formDataToSend);
            } else {
                console.log('📤 Enviando obra SIN nueva imagen');
                const updateData = {
                    title: formData.title,
                    description: formData.description,
                    id_categoria: formData.id_categoria || null,
                    id_emocion: formData.id_emocion || null
                };

                console.log('📄 Datos a enviar:', updateData);
                response = await obraService.update(obraId, updateData);
            }

            console.log('✅ Respuesta del servidor:', response.data);
            
            if (response.data.status === 'success') {
                console.log('🎉 Obra actualizada exitosamente');
                alert('¡Obra actualizada exitosamente!');
                onSuccess?.();
                onClose();
            } else {
                console.error('❌ Error en respuesta del servidor:', response.data);
                setError(response.data.message || 'Error al actualizar la obra');
            }

        } catch (error) {
            console.error('❌ Error actualizando obra:', error);

            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorMessages = Object.values(validationErrors).flat().join(', ');
                console.error('⚠️ Errores de validación:', validationErrors);
                setError(`Errores de validación: ${errorMessages}`);
            } else if (error.response?.status === 500) {
                console.error('💥 Error del servidor');
                setError('Error del servidor. Por favor, intente más tarde.');
            } else {
                const errorMessage = error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Error al actualizar la obra';
                console.error('❌ Error general:', errorMessage);
                setError(errorMessage);
            }
        } finally {
            setSaving(false);
        }
    };

    const removeImage = () => {
        console.log('🗑️ Removiendo imagen seleccionada');
        setFormData(prev => ({ ...prev, image: null }));
        
        // Restaurar la imagen original de la obra (si existe y es válida)
        if (obra?.image || obra?.image_url) {
            const originalUrl = getImageUrl(obra.image, obra.image_url);
            console.log('🔄 Restaurando imagen original:', originalUrl);
            
            // Solo restaurar si no es una ruta temporal
            if (originalUrl && 
                !originalUrl.includes('tmp') && 
                !originalUrl.includes('xampp') && 
                !originalUrl.includes('C:\\')) {
                setPreviewUrl(originalUrl);
            } else {
                console.log('⚠️ Imagen original es temporal, mostrando placeholder');
                setPreviewUrl('');
            }
        } else {
            console.log('📭 No hay imagen original para restaurar');
            setPreviewUrl('');
        }
    };

    const cancelEdit = () => {
        const hasChanges = 
            formData.title !== obra?.title ||
            formData.description !== obra?.description ||
            formData.id_categoria !== obra?.id_categoria ||
            formData.id_emocion !== obra?.id_emocion ||
            (formData.image && formData.image instanceof File);

        if (hasChanges) {
            if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
                console.log('❌ Edición cancelada por usuario');
                onClose();
            }
        } else {
            console.log('👋 Cerrando modal sin cambios');
            onClose();
        }
    };

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="edito-overlay">
                <div className="edito-modal-content edito-loading-modal">
                    <div className="edito-loading-spinner"></div>
                    <p className="edito-loading-text">Cargando obra...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="edito-overlay" onClick={(e) => e.target.className === 'edito-overlay' && cancelEdit()}>
            <div className="edito-modal-content">
                {/* Header del Modal */}
                <div className="edito-modal-header">
                    <div className="edito-header-content">
                        <h2 className="edito-modal-title">Editar Obra</h2>
                        <p className="edito-modal-subtitle">
                            Actualiza los detalles de "{obra?.title}"
                        </p>
                    </div>
                    <button onClick={cancelEdit} className="edito-modal-close-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                </div>

                <div className="edito-modal-body">
                    {error && (
                        <div className="edito-error-message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <div>
                                <strong>Error:</strong> {error}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="edito-edit-form">
                        {/* Sección de Imagen */}
                        <div className="edito-form-section">
                            <label className="edito-section-label">
                                Cambiar Imagen (opcional)
                            </label>

                            {previewUrl ? (
                                <div className="edito-image-preview-container">
                                    <div className="edito-image-preview">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="edito-preview-image"
                                            onError={(e) => {
                                                console.error('❌ Error cargando imagen en preview');
                                                e.target.style.display = 'none';
                                                // Mostrar placeholder o mensaje
                                                const container = e.target.parentElement;
                                                if (container) {
                                                    const fallback = document.createElement('div');
                                                    fallback.className = 'image-fallback';
                                                    fallback.innerHTML = '🖼️<br/><small>Imagen no disponible</small>';
                                                    container.appendChild(fallback);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="edito-remove-image-btn"
                                            title={formData.image instanceof File ? 
                                                "Cancelar nueva imagen" : 
                                                "Eliminar imagen actual"}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="edito-preview-text">
                                        {formData.image instanceof File ? 
                                            '📸 Nueva imagen seleccionada' : 
                                            '🖼️ Imagen actual'}
                                    </p>
                                </div>
                            ) : (
                                <div className="edito-image-upload-area">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="edito-image-input"
                                        id="edito-image-upload"
                                    />
                                    <label htmlFor="edito-image-upload" className="edito-upload-label">
                                        <div className="edito-upload-icon">🔄</div>
                                        <div className="edito-upload-text">
                                            <p className="edito-upload-main-text">Seleccionar nueva imagen</p>
                                            <p className="edito-upload-sub-text">PNG, JPG, JPEG, GIF hasta 5MB</p>
                                        </div>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Campo de Título */}
                        <div className="edito-form-section">
                            <label htmlFor="title" className="edito-section-label">
                                Título de la Obra *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                placeholder="Ej: Atardecer en la montaña"
                                className="edito-form-input"
                                maxLength={150}
                                disabled={saving}
                            />
                            <div className={`edito-char-counter ${formData.title.length > 140 ? 'warning' : ''}`}>
                                {formData.title.length}/150 caracteres
                            </div>
                        </div>

                        {/* Campo de Descripción */}
                        <div className="edito-form-section">
                            <label htmlFor="description" className="edito-section-label">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Describe tu obra, inspiración, técnica utilizada..."
                                rows={4}
                                className="edito-form-textarea"
                                disabled={saving}
                            />
                        </div>

                        {/* Selectores de Categoría y Emoción */}
                        <div className="edito-form-grid">
                            <div className="edito-form-section">
                                <label htmlFor="id_categoria" className="edito-section-label">
                                    Categoría
                                </label>
                                <select
                                    id="id_categoria"
                                    name="id_categoria"
                                    value={formData.id_categoria}
                                    onChange={handleInputChange}
                                    className="edito-form-select"
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

                            <div className="edito-form-section">
                                <label htmlFor="id_emocion" className="edito-section-label">
                                    Emoción
                                </label>
                                <select
                                    id="id_emocion"
                                    name="id_emocion"
                                    value={formData.id_emocion}
                                    onChange={handleInputChange}
                                    className="edito-form-select"
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

                        {/* Botones de Acción */}
                        <div className="edito-modal-actions">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="edito-cancel-btn"
                                disabled={saving}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="edito-submit-btn"
                            >
                                {saving ? (
                                    <div className="edito-loading-content">
                                        <div className="edito-loading-spinner-small"></div>
                                        Guardando...
                                    </div>
                                ) : (
                                    '💾 Guardar Cambios'
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