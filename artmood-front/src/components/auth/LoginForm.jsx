// components/auth/LoginForm.jsx - DISEÑO CREATIVO
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../common/Header';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './Login.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(formData);
    
    if (result.success) {
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="login-container">
     <Header />
      {/* Fondo animado con partículas */}
      <div className="login-background">
        <div className="floating-art-elements">
          <div className="art-element element-1">🎨</div>
          <div className="art-element element-2">✨</div>
          <div className="art-element element-3">❤️</div>
          <div className="art-element element-4">🌟</div>
          <div className="art-element element-5">🖌️</div>
          <div className="art-element element-6">🌈</div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Tarjeta de login */}
      <div className="login-card-wrapper">
        <Card className="login-card">
          {/* Header decorativo */}
          <div className="login-header">
            <div className="logo-art">
              <span className="logo-icon">🎨</span>
              <h1 className="logo-text">ArtMood</h1>
            </div>
            <div className="welcome-message">
              <h2>Bienvenido de vuelta</h2>
              <p>Tu galería de emociones te espera</p>
            </div>
          </div>

          {/* Formulario */}
          <div className="login-form-container">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              {/* Campo Email */}
              <div className="form-group-art">
                <div className="input-container">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    className="form-input-art"
                    disabled={loading}
                  />
                  <label htmlFor="email" className="input-label">
                    <span className="label-icon">📧</span>
                    Correo Electrónico
                  </label>
                  <div className="input-underline"></div>
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="form-group-art">
                <div className="input-container">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    className="form-input-art"
                    disabled={loading}
                  />
                  <label htmlFor="password" className="input-label">
                    <span className="label-icon">🔒</span>
                    Contraseña
                  </label>
                  <div className="input-underline"></div>
                </div>
              </div>

              {/* Botón de login */}
              <Button 
                type="submit"
                className="login-button-art"
                loading={loading}
                disabled={loading}
              >
                <span className="button-content">
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <span className="button-icon">🎨</span>
                      Ingresar a mi galería
                    </>
                  )}
                </span>
              </Button>
            </form>

            {/* Enlace de registro */}
            <div className="register-link-section">
              <p className="register-text">
                ¿Primera vez en ArtMood?{' '}
                <Link to="/register" className="register-link">
                  <span className="link-icon">🚀</span>
                  Crear cuenta creativa
                </Link>
              </p>
            </div>
          </div>

          {/* Footer decorativo */}
          <div className="login-footer">
            <div className="security-note">
              <span className="security-icon">🛡️</span>
              Tu creatividad está segura con nosotros
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;