import React, { useState, useEffect } from 'react';
import { obraService } from '../../services/obraService';
import { categoryService } from '../../services/categoryService';

const Gallery = () => {
  const [obras, setObras] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const getCategoriaNombre = (idCategoria) => {
    const categoria = categorias.find(cat => cat.id_categoria === idCategoria);
    return categoria ? categoria.name : 'Sin categoría';
  };

  const getEmojiEmocion = (emocion) => {
    if (!emocion) return '';
    return emocion.icon || '🎨';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Galería de Arte
        </h1>
        <p className="text-gray-600 mt-2">
          Descubre {obras.length} obras de nuestra comunidad creativa
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🎨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Obras</p>
              <p className="text-2xl font-bold text-gray-900">{obras.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Artistas Únicos</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(obras.map(obra => obra.id_usuario)).size}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">📂</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-2xl font-bold text-gray-900">{categorias.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid de obras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {obras.map((obra) => (
          <div key={obra.id_obra} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            {/* Imagen de la obra */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {obra.imagen ? (
                <img 
                  src={`http://localhost:8000/storage/${obra.imagen}`}
                  alt={obra.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=ArtMood';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-4xl">🎨</span>
                </div>
              )}
            </div>

            {/* Contenido de la tarjeta */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                  {obra.title}
                </h3>
                <span className="text-2xl ml-2">
                  {getEmojiEmocion(obra.emotion)}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {obra.description || 'Sin descripción'}
              </p>

              {/* Información de categoría y artista */}
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                  {getCategoriaNombre(obra.id_categoria)}
                </span>
                <span>por {obra.user?.nickname || 'Anónimo'}</span>
              </div>

              {/* Fecha de publicación */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Publicado el {new Date(obra.fecha_publicacion).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay obras */}
      {obras.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay obras aún
          </h3>
          <p className="text-gray-600">
            Sé el primero en compartir tu arte con la comunidad
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;