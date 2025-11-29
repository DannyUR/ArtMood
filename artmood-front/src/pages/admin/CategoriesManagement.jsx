import React, { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Categorías
        </h1>
        <p className="text-gray-600 mt-2">
          Administra las {categories.length} categorías disponibles para las obras
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Grid de categorías */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id_categoria} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {category.name}
              </h3>
              <span className="text-2xl">📂</span>
            </div>
            
            <p className="text-gray-600 mb-4">
              {category.description || 'Sin descripción'}
            </p>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                ID: {category.id_categoria}
              </span>
              <button
                onClick={() => handleDeleteCategory(category.id_categoria, category.name)}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay categorías */}
      {categories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay categorías
          </h3>
          <p className="text-gray-600">
            Las categorías aparecerán aquí cuando se creen
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoriesManagement;