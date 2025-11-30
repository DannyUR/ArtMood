// components/gallery/GalleryFilters.jsx
import React, { useState } from 'react';
import { emotionService } from '../../services/emotionService';
import { categoryService } from '../../services/categoryService';

const GalleryFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    emocion: '',
    categoria: '',
    fecha: '',
    orden: 'recientes'
  });
  const [emociones, setEmociones] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const loadData = async () => {
    try {
      const [emocionesRes, categoriasRes] = await Promise.all([
        emotionService.getAll(),
        categoryService.getAll()
      ]);
      setEmociones(emocionesRes.data);
      setCategorias(categoriasRes.data);
    } catch (error) {
      console.error('Error cargando filtros:', error);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      emocion: '',
      categoria: '',
      fecha: '',
      orden: 'recientes'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="gallery-filters">
      <div className="filters-header">
        <h3>Filtrar Galería</h3>
        <button onClick={clearFilters} className="btn-clear">
          Limpiar Filtros
        </button>
      </div>

      <div className="filters-grid">
        {/* Filtro por Emoción */}
        <div className="filter-group">
          <label>Emoción</label>
          <select 
            value={filters.emocion}
            onChange={(e) => handleFilterChange('emocion', e.target.value)}
          >
            <option value="">Todas las emociones</option>
            {emociones.map(emocion => (
              <option key={emocion.id_emocion} value={emocion.id_emocion}>
                {emocion.icono} {emocion.nombre_emocion}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por Categoría */}
        <div className="filter-group">
          <label>Categoría</label>
          <select 
            value={filters.categoria}
            onChange={(e) => handleFilterChange('categoria', e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre_categoria}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenamiento */}
        <div className="filter-group">
          <label>Ordenar por</label>
          <select 
            value={filters.orden}
            onChange={(e) => handleFilterChange('orden', e.target.value)}
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguos">Más antiguos</option>
            <option value="populares">Más populares</option>
            <option value="reacciones">Más reacciones</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default GalleryFilters;