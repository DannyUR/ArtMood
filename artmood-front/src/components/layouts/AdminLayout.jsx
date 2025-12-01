import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';

const AdminLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  return (
    <div className="main-content"> {/* ← CAMBIA esta línea */}
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 ml-64">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;