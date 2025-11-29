import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Gallery = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Bienvenido, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Explora las obras de arte de nuestra comunidad
        </p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Galería de Arte</h2>
        <p className="text-gray-600">
          Aquí se mostrarán todas las obras de la comunidad. (En desarrollo)
        </p>
        <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
          <p className="text-gray-500">Las obras aparecerán aquí</p>
        </div>
      </div>
    </div>
  );
};

export default Gallery;