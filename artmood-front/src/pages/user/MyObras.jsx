import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';

const MyObras = () => {
  const { user } = useAuth();
  const [obras, setObras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyObras();
    loadCategorias();
  }, []);

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

  // SVG placeholder como fallback
  const placeholderSVG = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjNEY0NkU1Ii8+Cjx0ZXh0IHg9IjI0IiB5PSIyOCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+8J+OqDwvdGV4dD4KPC9zdmc+';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mis Obras
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona las {obras.length} obras que has publicado
            </p>
          </div>
          <Link
            to="/user/upload"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>📤</span>
            <span>Subir Nueva Obra</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🎨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Obras</p>
              <p className="text-2xl font-bold text-gray-900">{obras.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Más Reciente</p>
              <p className="text-lg font-bold text-gray-900">
                {obras.length > 0 ? new Date(obras[0].fecha_publicacion).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">👁️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Galería</p>
              <p className="text-2xl font-bold text-gray-900">{obras.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">😊</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emociones</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(obras.filter(obra => obra.id_emocion).map(obra => obra.id_emocion)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de obras */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Obra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Información
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría & Emoción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {obras.map((obra) => (
                <tr key={obra.id_obra} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {obra.imagen ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={`http://localhost:8000/storage/${obra.imagen}`}
                            alt={obra.title}
                            onError={(e) => {
                              e.target.src = placeholderSVG;
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                            <span className="text-white text-lg">🎨</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {obra.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {obra.id_obra}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs">
                      {obra.description || 'Sin descripción'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {getCategoriaNombre(obra.id_categoria)}
                      </span>
                      {obra.emotion && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                          <span className="mr-1">{getEmojiEmocion(obra.emotion)}</span>
                          {obra.emotion.name}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(obra.fecha_publicacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/user/edit-obra/${obra.id_obra}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDeleteObra(obra.id_obra, obra.title)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                      <Link
                        to="/user"
                        className="text-green-600 hover:text-green-900"
                      >
                        Ver en Galería
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mensaje si no hay obras */}
      {obras.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Aún no has publicado obras
          </h3>
          <p className="text-gray-600 mb-4">
            Comparte tu primera obra con la comunidad ArtMood
          </p>
          <Link
            to="/user/upload"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>📤</span>
            <span>Publicar Mi Primera Obra</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyObras;