import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import './styles/globals.css';

// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import AuthLayout from './components/layouts/AuthLayout';
import UserLayout from './components/layouts/UserLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Pages
import Home from './pages/public/Home';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import Gallery from './pages/user/Gallery';
import Dashboard from './pages/admin/Dashboard';
import UsersManagement from './pages/admin/UsersManagement';
import CategoriesManagement from './pages/admin/CategoriesManagement';
import ObrasManagement from './pages/admin/ObrasManagement';
import UploadObra from './pages/user/UploadObra';
import EmotionsManagement from './pages/admin/EmotionsManagement';
import EditObra from './pages/user/EditObra';
import MyObras from './pages/user/MyObras';
import Profile from './pages/user/Profile';
import About from './pages/public/About';
import EditProfile from './pages/user/EditProfile';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
            </Route>

            {/* Rutas de autenticación */}
            <Route path="/" element={<AuthLayout />}>
              <Route path="login" element={<LoginForm />} />
              <Route path="register" element={<RegisterForm />} />
            </Route>

            {/* Rutas de usuario */}
            <Route path="/user" element={<UserLayout />}>
              <Route index element={<Gallery />} />
              <Route path="my-obras" element={<MyObras />} />
              <Route path="upload" element={<UploadObra />} />
              <Route path="edit-obra/:id" element={<EditObra />} />
              <Route path="profile" element={<Profile />} />
              <Route path="profile/edit" element={<EditProfile />} /> {/* ← CORREGIDO */}
            </Route>

            {/* ✅ AGREGAR ESTA RUTA PARA COMPATIBILIDAD */}
            <Route path="/gallery" element={<Navigate to="/user" replace />} />
            <Route path="/upload" element={<Navigate to="/user/upload" replace />} />
            <Route path="/profile/edit" element={<Navigate to="/user/profile/edit" replace />} /> {/* ← AÑADE ESTA REDIRECCIÓN SI NECESITAS ACCESO DIRECTO */}

            {/* Rutas de administrador */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="obras" element={<ObrasManagement />} />
              <Route path="usuarios" element={<UsersManagement />} />
              <Route path="categorias" element={<CategoriesManagement />} />
              <Route path="emociones" element={<EmotionsManagement />} />
            </Route>

            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;