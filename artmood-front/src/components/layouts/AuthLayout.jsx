// AuthLayout.jsx - VERSIÓN MINIMALISTA
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = () => {
  const { user } = useAuth();

  // Si ya está autenticado, redirigir según su rol
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
  }

  return (
    <div className="main-content">
      <Outlet /> {/* ← Solo esto, sin diseño extra */}
    </div>
  );
};

export default AuthLayout;