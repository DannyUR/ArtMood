import React from 'react';
import CommentsSection from '../comments/CommentsSection';

const ObraDetailModal = ({ obra, isOpen, onClose }) => {
  if (!isOpen || !obra) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{obra.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imagen */}
            <div>
              {obra.imagen ? (
                <img
                  src={`http://localhost:8000/storage/${obra.imagen}`}
                  alt={obra.title}
                  className="w-full h-64 lg:h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 lg:h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-4xl">🎨</span>
                </div>
              )}
            </div>

            {/* Información */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Descripción</h3>
                <p className="text-gray-600 mt-1">
                  {obra.description || 'Sin descripción'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Artista</h4>
                  <p className="text-gray-600">@{obra.user?.nickname || 'Anónimo'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Publicado</h4>
                  <p className="text-gray-600">
                    {new Date(obra.fecha_publicacion).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Categoría y Emoción */}
              <div className="flex space-x-2">
                {obra.id_categoria && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                    {obra.categoria?.name || 'Categoría'}
                  </span>
                )}
                {obra.emotion && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {obra.emotion.icon} {obra.emotion.name}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sección de comentarios */}
          <div className="mt-8">
            <CommentsSection obraId={obra.id_obra} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObraDetailModal;