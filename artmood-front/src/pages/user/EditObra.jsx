import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';
import { emotionService } from '../../services/emotionService';

const EditObra = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams(); // ID de la obra a editar

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

            // Verificar que el usuario es el propietario de la obra
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

            // Cargar preview de la imagen actual
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
            // Validar tipo de archivo
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona un archivo de imagen válido');
                return;
            }

            // Validar tamaño (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen debe ser menor a 5MB');
                return;
            }

            setFormData(prev => ({
                ...prev,
                image: file
            }));

            // Crear preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.title.trim()) {
            setError('El título es obligatorio');
            return;
        }

        setSaving(true);
        setError('');

        try {
            let response;

            if (formData.image) {
                // Si hay nueva imagen, usar FormData
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
                // Si no hay nueva imagen, usar JSON normal - CORREGIDO
                const updateData = {
                    title: formData.title,           // Cambiado a inglés
                    description: formData.description, // Cambiado a inglés
                    id_categoria: formData.id_categoria || null,
                    id_emocion: formData.id_emocion || null
                };

                response = await obraService.update(id, updateData);
            }

            // Éxito
            alert('¡Obra actualizada exitosamente!');
            navigate('/user/my-obras'); // Mejor redirigir a Mis Obras

        } catch (error) {
            console.error('Error actualizando obra:', error);

            // Mostrar errores detallados de validación
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
            navigate('/user/my-obras'); // Mejor redirigir a Mis Obras
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error && !obra) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
                <button
                    onClick={() => navigate('/user/my-obras')} // Cambiado
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                >
                    Volver a Mis Obras
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Editar Obra: {obra?.title}
                </h1>
                <p className="text-gray-600 mt-2">
                    Actualiza los detalles de tu obra
                </p>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        <strong>Error:</strong> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Preview de imagen */}
                    {previewUrl && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <div className="relative inline-block">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="max-h-64 max-w-full rounded-lg shadow-md"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                {formData.image ? 'Nueva imagen seleccionada' : 'Imagen actual'}
                            </p>
                        </div>
                    )}

                    {/* Campo de imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cambiar Imagen (opcional)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer block"
                            >
                                <div className="text-4xl mb-2">🔄</div>
                                <p className="text-lg font-medium text-gray-900">
                                    {previewUrl ? 'Cambiar imagen' : 'Seleccionar nueva imagen'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    PNG, JPG, JPEG hasta 5MB
                                </p>
                            </label>
                        </div>
                    </div>

                    {/* Campo título */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            Título de la Obra *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Ej: Atardecer en la montaña"
                            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            maxLength={150}
                            disabled={saving}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.title.length}/150 caracteres
                        </p>
                    </div>

                    {/* Campo descripción */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe tu obra, inspiración, técnica utilizada..."
                            rows={4}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                            disabled={saving}
                        />
                    </div>

                    {/* Selectores de categoría y emoción */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Categoría */}
                        <div>
                            <label htmlFor="id_categoria" className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría
                            </label>
                            <select
                                id="id_categoria"
                                name="id_categoria"
                                value={formData.id_categoria}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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

                        {/* Emoción */}
                        <div>
                            <label htmlFor="id_emocion" className="block text-sm font-medium text-gray-700 mb-2">
                                Emoción
                            </label>
                            <select
                                id="id_emocion"
                                name="id_emocion"
                                value={formData.id_emocion}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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

                    {/* Información de la obra */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Información de la obra:</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium">ID:</span> {obra?.id_obra}
                            </div>
                            <div>
                                <span className="font-medium">Publicada:</span> {obra && new Date(obra.fecha_publicacion).toLocaleDateString()}
                            </div>
                            <div>
                                <span className="font-medium">Artista:</span> {user?.name}
                            </div>
                            <div>
                                <span className="font-medium">Usuario:</span> @{user?.nickname}
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={cancelEdit}
                            className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                            disabled={saving}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
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
    );
};

export default EditObra;