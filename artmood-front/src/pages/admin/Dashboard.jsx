import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Panel de Administración
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {user?.name}. Gestiona la plataforma ArtMood.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Usuarios</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <p className="text-gray-600 text-sm">Usuarios registrados</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Obras</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <p className="text-gray-600 text-sm">Obras publicadas</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">Comentarios</h3>
          <p className="text-3xl font-bold text-purple-600">0</p>
          <p className="text-gray-600 text-sm">Comentarios realizados</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Resumen de Actividad</h2>
        <p className="text-gray-600">
          Aquí irá el resumen de actividad reciente. (En desarrollo)
        </p>
      </div>
    </div>
  );
};

export default Dashboard;