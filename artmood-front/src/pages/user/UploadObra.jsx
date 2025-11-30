import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';
import { emotionService } from '../../services/emotionService';

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

    console.log('Usuario completo:', user);
    console.log('ID del usuario:', user?.id, user?.id_usuario);

    // Validaciones
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!formData.image) {
      setError('Debes seleccionar una imagen');
      return;
    }

    // Verificar que tenemos el ID del usuario
    if (!user || (!user.id && !user.id_usuario)) {
      setError('No se pudo obtener la información del usuario. Por favor, inicia sesión nuevamente.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Usar el campo correcto del ID del usuario
      const userId = user.id_usuario || user.id;

      console.log('ID de usuario a enviar:', userId);

      // Crear FormData para enviar la imagen
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

      // Asegurarse de que la imagen se está agregando correctamente
      console.log('Archivo de imagen:', formData.image);
      formDataToSend.append('image', formData.image);

      // Debug: mostrar qué hay en el FormData
      console.log('FormData contenido:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }

      console.log('Enviando datos:', {
        title: formData.title,
        id_usuario: userId,
        image: formData.image.name
      });

      // Enviar a la API
      const response = await obraService.create(formDataToSend);

      // Éxito
      alert('¡Obra publicada exitosamente!');
      navigate('/user');

    } catch (error) {
      console.error('Error creando obra:', error);

      // Mostrar errores detallados de validación
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Publicar Nueva Obra
        </h1>
        <p className="text-gray-600 mt-2">
          Comparte tu arte con la comunidad ArtMood
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
                Vista previa de tu obra
              </p>
            </div>
          )}

          {/* Campo de imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagen de la Obra *
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
                <div className="text-4xl mb-2">📸</div>
                <p className="text-lg font-medium text-gray-900">
                  {previewUrl ? 'Cambiar imagen' : 'Seleccionar imagen'}
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
              disabled={loading}
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
              disabled={loading}
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

          {/* Información del artista */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Publicar como:</h3>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">@{user?.nickname}</p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/user')}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Publicando...
                </div>
              ) : (
                'Publicar Obra'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Información de ayuda */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Consejos para una buena publicación:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Usa un título descriptivo y atractivo</li>
          <li>• Selecciona una imagen de alta calidad</li>
          <li>• Describe tu proceso creativo o inspiración</li>
          <li>• Elige categorías y emociones que representen tu obra</li>
        </ul>
      </div>
    </div>
  );
};

export default UploadObra;