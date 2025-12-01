// components/auth/RegisterForm.jsx - VERSIÓN CORREGIDA
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import Button from '../ui/Button';
import Card from '../ui/Card';
import './Register.css';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
    
    // Validaciones
    if (formData.password !== formData.password_confirmation) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await authService.register(formData);
      
      // Guardar token y usuario automáticamente
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Redirigir al dashboard del usuario
      navigate('/user');
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Error al registrar usuario';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* Fondo animado con partículas */}
      <div className="register-background">
        <div className="floating-art-elements">
          <div className="art-element element-1">🎨</div>
          <div className="art-element element-2">✨</div>
          <div className="art-element element-3">❤️</div>
          <div className="art-element element-4">🌟</div>
          <div className="art-element element-5">🖌️</div>
          <div className="art-element element-6">🌈</div>
          <div className="art-element element-7">👨‍🎨</div>
          <div className="art-element element-8">👩‍🎨</div>
        </div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Tarjeta de registro */}
      <div className="register-card-wrapper">
        <Card className="register-card">
          {/* Header decorativo */}
          <div className="register-header">
            <div className="logo-art">
              <span className="logo-icon">🎨</span>
              <h1 className="logo-text">ArtMood</h1>
            </div>
            <div className="welcome-message">
              <h2>Únete a la comunidad</h2>
              <p>Crea tu perfil de artista digital</p>
            </div>
          </div>

          {/* Formulario */}
          <div className="register-form-container">
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                <strong>Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              {/* Campo Nombre Completo */}
              <div className="form-group-art">
                <div className="input-container">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    className="form-input-art"
                    disabled={loading}
                  />
                  <label htmlFor="name" className="input-label">
                    <span className="label-icon">👤</span>
                    Nombre Completo
                  </label>
                  <div className="input-underline"></div>
                </div>
              </div>

              {/* Campo Nombre de Usuario */}
              <div className="form-group-art">
                <div className="input-container">
                  <input
                    id="nickname"
                    name="nickname"
                    type="text"
                    required
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder=" "
                    className="form-input-art"
                    disabled={loading}
                  />
                  <label htmlFor="nickname" className="input-label">
                    <span className="label-icon">🎭</span>
                    Nombre de Usuario
                  </label>
                  <div className="input-underline"></div>
                </div>
              </div>

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
                    minLength="6"
                  />
                  <label htmlFor="password" className="input-label">
                    <span className="label-icon">🔒</span>
                    Contraseña
                  </label>
                  <div className="input-underline"></div>
                </div>
                <div className="password-hint">
                  Mínimo 6 caracteres
                </div>
              </div>

              {/* Campo Confirmar Contraseña */}
              <div className="form-group-art">
                <div className="input-container">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder=" "
                    className="form-input-art"
                    disabled={loading}
                    minLength="6"
                  />
                  <label htmlFor="password_confirmation" className="input-label">
                    <span className="label-icon">✅</span>
                    Confirmar Contraseña
                  </label>
                  <div className="input-underline"></div>
                </div>
              </div>

              {/* Botón de registro */}
              <Button 
                type="submit"
                className="register-button"
                loading={loading}
                disabled={loading}
              >
                <span className="button-content">
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Creando tu cuenta...
                    </>
                  ) : (
                    <>
                      <span className="button-icon">🚀</span>
                      Crear mi cuenta creativa
                    </>
                  )}
                </span>
              </Button>
            </form>

            {/* Enlace de login */}
            <div className="login-link-section">
              <p className="login-text">
                ¿Ya eres parte de ArtMood?{' '}
                <Link to="/login" className="login-link">
                  <span className="link-icon">🎨</span>
                  Iniciar sesión aquí
                </Link>
              </p>
            </div>
          </div>

          {/* Footer decorativo */}
          <div className="register-footer">
            <div className="security-note">
              <span className="security-icon">🛡️</span>
              Comienza tu viaje artístico con nosotros
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterForm;