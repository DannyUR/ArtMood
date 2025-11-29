import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { obraService } from '../../services/obraService';
import { userService } from '../../services/userService';
import { categoryService } from '../../services/categoryService';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalObras: 0,
    totalUsuarios: 0,
    totalCategorias: 0,
    obrasRecientes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [obrasData, usuariosData, categoriasData] = await Promise.all([
        obraService.getAll(),
        userService.getAll(),
        categoryService.getAll()
      ]);

      setStats({
        totalObras: obrasData.length,
        totalUsuarios: usuariosData.length,
        totalCategorias: categoriasData.length,
        obrasRecientes: obrasData.slice(0, 5) // Últimas 5 obras
      });
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
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
          Panel de Administración
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido, {user?.name}. Gestiona la plataforma ArtMood.
        </p>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <span className="text-2xl">🎨</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Obras</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalObras}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Usuarios Registrados</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalUsuarios}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">📂</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categorías</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCategorias}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Obras recientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Obras Recientes</h2>
          <div className="space-y-4">
            {stats.obrasRecientes.map(obra => (
              <div key={obra.id_obra} className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white text-lg">🎨</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {obra.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    por {obra.user?.nickname || 'Anónimo'}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(obra.fecha_publicacion).toLocaleDateString()}
                </div>
              </div>
            ))}
            {stats.obrasRecientes.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay obras recientes</p>
            )}
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Acciones Rápidas</h2>
          <div className="space-y-3">
            <a 
              href="/admin/obras" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Gestionar Obras</p>
                  <p className="text-sm text-gray-600">Ver, editar y eliminar obras</p>
                </div>
                <span className="text-2xl">🎨</span>
              </div>
            </a>
            
            <a 
              href="/admin/usuarios" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Gestionar Usuarios</p>
                  <p className="text-sm text-gray-600">Administrar usuarios registrados</p>
                </div>
                <span className="text-2xl">👥</span>
              </div>
            </a>
            
            <a 
              href="/admin/categorias" 
              className="block w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Gestionar Categorías</p>
                  <p className="text-sm text-gray-600">Administrar categorías de obras</p>
                </div>
                <span className="text-2xl">📂</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;