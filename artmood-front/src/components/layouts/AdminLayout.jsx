import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/user" replace />;
  }

  return (
    <div className="am-admin-layout">
      <Sidebar />
      <main className="am-admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;