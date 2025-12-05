import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import TextArea from '../../components/ui/TextArea';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './EditProfile.css';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados para el formulario
  const [editProfileForm, setEditProfileForm] = useState({
    editProfileNombre: '',
    editProfileNickname: '',
    editProfileEmail: '',
    editProfileBio: '',
    editProfileWebsite: '',
    editProfileLocation: '',
    editProfileFoto: ''
  });

  // Estados para preferencias
  const [editProfilePreferences, setEditProfilePreferences] = useState({
    editProfileStyle: 'Digital',
    editProfileSpecialties: ['Digital Art', 'Character Design'],
    editProfilePrivacy: {
      editProfilePublic: true,
      editProfileStats: true,
      editProfileMessages: false
    }
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setEditProfileForm({
        editProfileNombre: user.nombre || '',
        editProfileNickname: user.nickname || '',
        editProfileEmail: user.email || '',
        editProfileBio: user.bio || '',
        editProfileWebsite: user.website || '',
        editProfileLocation: user.location || '',
        editProfileFoto: user.foto_perfil || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePreferenceChange = (name, value) => {
    setEditProfilePreferences(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrivacyChange = (name) => {
    setEditProfilePreferences(prev => ({
      ...prev,
      editProfilePrivacy: {
        ...prev.editProfilePrivacy,
        [name]: !prev.editProfilePrivacy[name]
      }
    }));
  };

  const handleAddSpecialty = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      const newSpecialty = e.target.value.trim();
      if (!editProfilePreferences.editProfileSpecialties.includes(newSpecialty)) {
        setEditProfilePreferences(prev => ({
          ...prev,
          editProfileSpecialties: [...prev.editProfileSpecialties, newSpecialty]
        }));
      }
      e.target.value = '';
    }
  };

  const handleRemoveSpecialty = (specialty) => {
    setEditProfilePreferences(prev => ({
      ...prev,
      editProfileSpecialties: prev.editProfileSpecialties.filter(s => s !== specialty)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validaciones básicas
      if (!editProfileForm.editProfileNombre.trim()) {
        throw new Error('El nombre es requerido');
      }
      if (!editProfileForm.editProfileNickname.trim()) {
        throw new Error('El nickname es requerido');
      }
      if (!editProfileForm.editProfileEmail.trim()) {
        throw new Error('El email es requerido');
      }

      // Preparar datos para enviar
      const profileData = {
        nombre: editProfileForm.editProfileNombre,
        nickname: editProfileForm.editProfileNickname,
        email: editProfileForm.editProfileEmail,
        bio: editProfileForm.editProfileBio,
        website: editProfileForm.editProfileWebsite,
        location: editProfileForm.editProfileLocation,
        foto_perfil: editProfileForm.editProfileFoto,
        preferences: editProfilePreferences
      };

      // Simular actualización
      await updateProfile(profileData);
      
      setSuccess('🎉 ¡Perfil actualizado exitosamente!');
      setTimeout(() => {
        navigate('/user/profile');
      }, 2000);

    } catch (err) {
      setError(err.message || '❌ Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Seguro que quieres cancelar? Los cambios no guardados se perderán.')) {
      navigate('/user/profile');
    }
  };

  const handleImageUpload = (e) => {
    // Simulación de carga de imagen
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditProfileForm(prev => ({
          ...prev,
          editProfileFoto: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="ep-container">
        <div className="ep-error-state">
          <Card className="ep-error-card">
            <div className="ep-error-content">
              <div className="ep-error-icon">🔒</div>
              <h2 className="ep-error-title">Acceso Restringido</h2>
              <p className="ep-error-message">Debes iniciar sesión para editar tu perfil</p>
              <Button 
                onClick={() => navigate('/login')}
                className="ep-login-button"
              >
                🚀 Ir a Iniciar Sesión
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="ep-container">
      {/* Header creativo */}
      <div className="ep-hero-section">
        <div className="ep-hero-background">
          <div className="ep-bg-gradient"></div>
          <div className="ep-bg-pattern"></div>
        </div>
        
        <Card className="ep-header-card">
          <div className="ep-header-content">
            <div className="ep-avatar-section">
              <div className="ep-avatar-wrapper">
                <img 
                  src={editProfileForm.editProfileFoto || user?.foto_perfil || '/default-avatar.png'} 
                  alt={editProfileForm.editProfileNombre}
                  className="ep-avatar-image"
                />
                <div className="ep-avatar-edit-overlay">
                  <label htmlFor="ep-avatar-upload" className="ep-avatar-edit-btn">
                    📷
                  </label>
                  <input 
                    type="file" 
                    id="ep-avatar-upload" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="ep-avatar-input"
                  />
                </div>
                <div className="ep-avatar-glow"></div>
              </div>
              <div className="ep-avatar-status">
                <span className="ep-status-indicator"></span>
                <span className="ep-status-text">Editando</span>
              </div>
            </div>
            
            <div className="ep-header-info">
              <div className="ep-title-section">
                <h1 className="ep-main-title">Transforma Tu Perfil</h1>
                <div className="ep-subtitle-wrapper">
                  <span className="ep-subtitle-icon">🎨</span>
                  <p className="ep-subtitle">Dale vida a tu identidad artística</p>
                </div>
              </div>
              
              <div className="ep-current-info">
                <div className="ep-current-user">
                  <span className="ep-user-arroba">@</span>
                  <span className="ep-user-name">{editProfileForm.editProfileNickname || user?.nickname}</span>
                </div>
                <div className="ep-edit-badge">
                  <span className="ep-badge-icon">✏️</span>
                  <span className="ep-badge-text">Modo Edición</span>
                </div>
              </div>
            </div>

            <div className="ep-header-actions">
              <Button 
                variant="gradient" 
                className="ep-save-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                <span className="ep-btn-icon">💾</span>
                <span className="ep-btn-text">
                  {loading ? 'Guardando...' : 'Guardar Transformación'}
                </span>
                <div className="ep-btn-glow"></div>
              </Button>
              
              <Button 
                variant="glass" 
                className="ep-cancel-btn"
                onClick={handleCancel}
                disabled={loading}
              >
                <span className="ep-btn-icon">↩️</span>
                <span className="ep-btn-text">Descartar Cambios</span>
              </Button>
            </div>
          </div>
          
          <div className="ep-progress-indicator">
            <div className="ep-progress-bar">
              <div 
                className="ep-progress-fill" 
                style={{ width: '40%' }}
              ></div>
            </div>
            <div className="ep-progress-text">Completado: 40%</div>
          </div>
        </Card>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="ep-message-container">
          <Card className="ep-message-card ep-error-message">
            <div className="ep-message-content">
              <div className="ep-message-icon">⚠️</div>
              <div className="ep-message-text">
                <h4 className="ep-message-title">¡Atención!</h4>
                <p className="ep-message-desc">{error}</p>
              </div>
              <button 
                onClick={() => setError('')}
                className="ep-message-close"
              >
                ×
              </button>
            </div>
          </Card>
        </div>
      )}

      {success && (
        <div className="ep-message-container">
          <Card className="ep-message-card ep-success-message">
            <div className="ep-message-content">
              <div className="ep-message-icon">✨</div>
              <div className="ep-message-text">
                <h4 className="ep-message-title">¡Éxito!</h4>
                <p className="ep-message-desc">{success}</p>
              </div>
              <div className="ep-success-sparkles">
                <span>✨</span>
                <span>✨</span>
                <span>✨</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Formulario principal */}
      <Card className="ep-form-card">
        <div className="ep-form-header">
          <div className="ep-form-title-section">
            <h2 className="ep-form-title">Tu Canvas Digital</h2>
            <p className="ep-form-subtitle">Pinta tu identidad con cada detalle</p>
          </div>
          <div className="ep-form-guide">
            <span className="ep-guide-icon">💡</span>
            <span className="ep-guide-text">Los campos marcados con * son obligatorios</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ep-main-form">
          <div className="ep-form-grid">
            {/* Columna izquierda - Información esencial */}
            <div className="ep-form-column ep-left-column">
              <div className="ep-form-section ep-essentials-section">
                <div className="ep-section-header">
                  <div className="ep-section-icon">👑</div>
                  <h3 className="ep-section-title">Esencia Creativa</h3>
                </div>
                
                <div className="ep-form-group ep-glow-group">
                  <label htmlFor="editProfileNombre" className="ep-form-label">
                    <span className="ep-label-icon">🌟</span>
                    Nombre Artístico *
                  </label>
                  <Input
                    id="editProfileNombre"
                    name="editProfileNombre"
                    value={editProfileForm.editProfileNombre}
                    onChange={handleInputChange}
                    placeholder="Tu nombre creativo"
                    required
                    fullWidth
                    className="ep-glow-input"
                  />
                  <div className="ep-form-hint ep-animated-hint">
                    Este será tu sello personal en la comunidad
                  </div>
                </div>

                <div className="ep-form-group ep-glow-group">
                  <label htmlFor="editProfileNickname" className="ep-form-label">
                    <span className="ep-label-icon">🔖</span>
                    Alias Único *
                  </label>
                  <Input
                    id="editProfileNickname"
                    name="editProfileNickname"
                    value={editProfileForm.editProfileNickname}
                    onChange={handleInputChange}
                    placeholder="tu_identidad_unica"
                    required
                    fullWidth
                    className="ep-glow-input"
                  />
                  <div className="ep-form-hint">
                    <span className="ep-hint-icon">🎯</span>
                    Tu huella digital en ArtMood
                  </div>
                </div>

                <div className="ep-form-group ep-glow-group">
                  <label htmlFor="editProfileEmail" className="ep-form-label">
                    <span className="ep-label-icon">✉️</span>
                    Correo Mágico *
                  </label>
                  <Input
                    id="editProfileEmail"
                    name="editProfileEmail"
                    type="email"
                    value={editProfileForm.editProfileEmail}
                    onChange={handleInputChange}
                    placeholder="arte@creativo.com"
                    required
                    fullWidth
                    className="ep-glow-input"
                  />
                  <div className="ep-form-hint">
                    <span className="ep-hint-icon">🛡️</span>
                    Protegido y privado
                  </div>
                </div>

                <div className="ep-form-group ep-glow-group">
                  <label htmlFor="editProfileLocation" className="ep-form-label">
                    <span className="ep-label-icon">🌍</span>
                    Origen Creativo
                  </label>
                  <Input
                    id="editProfileLocation"
                    name="editProfileLocation"
                    value={editProfileForm.editProfileLocation}
                    onChange={handleInputChange}
                    placeholder="Ciudad, Planeta Creativo"
                    fullWidth
                    className="ep-glow-input"
                  />
                </div>
              </div>

              <div className="ep-form-section ep-avatar-section-detailed">
                <div className="ep-section-header">
                  <div className="ep-section-icon">🖼️</div>
                  <h3 className="ep-section-title">Tu Retrato Digital</h3>
                </div>
                
                <div className="ep-avatar-upload-area">
                  <div className="ep-avatar-preview-container">
                    <div className="ep-avatar-frame">
                      <img 
                        src={editProfileForm.editProfileFoto || user?.foto_perfil || '/default-avatar.png'} 
                        alt="Vista previa"
                        className="ep-avatar-preview"
                      />
                      <div className="ep-avatar-frame-decoration"></div>
                    </div>
                    
                    <div className="ep-avatar-upload-options">
                      <div className="ep-upload-method ep-url-method">
                        <div className="ep-method-header">
                          <span className="ep-method-icon">🔗</span>
                          <span className="ep-method-title">Desde URL</span>
                        </div>
                        <Input
                          id="editProfileFoto"
                          name="editProfileFoto"
                          value={editProfileForm.editProfileFoto}
                          onChange={handleInputChange}
                          placeholder="https://tu-arte.com/retrato.jpg"
                          fullWidth
                          className="ep-url-input"
                        />
                      </div>
                      
                      <div className="ep-upload-method ep-file-method">
                        <div className="ep-method-header">
                          <span className="ep-method-icon">📁</span>
                          <span className="ep-method-title">Subir Archivo</span>
                        </div>
                        <label htmlFor="ep-file-upload" className="ep-file-upload-label">
                          <span className="ep-upload-icon">⬆️</span>
                          <span className="ep-upload-text">Elegir Imagen</span>
                          <input 
                            type="file" 
                            id="ep-file-upload" 
                            accept="image/*" 
                            onChange={handleImageUpload}
                            className="ep-file-input"
                          />
                        </label>
                      </div>
                    </div>
                    
                    <div className="ep-avatar-suggestions">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="small"
                        onClick={() => setEditProfileForm(prev => ({
                          ...prev,
                          editProfileFoto: '/default-avatar.png'
                        }))}
                        className="ep-default-avatar-btn"
                      >
                        🎭 Usar Avatar Clásico
                      </Button>
                      <div className="ep-avatar-specs">
                        <span className="ep-spec-icon">📐</span>
                        <span className="ep-spec-text">Recomendado: 400×400px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Expresión creativa */}
            <div className="ep-form-column ep-right-column">
              <div className="ep-form-section ep-bio-section">
                <div className="ep-section-header">
                  <div className="ep-section-icon">📖</div>
                  <h3 className="ep-section-title">Tu Historia Creativa</h3>
                </div>
                
                <div className="ep-form-group ep-bio-group">
                  <label htmlFor="editProfileBio" className="ep-form-label">
                    <span className="ep-label-icon">🖋️</span>
                    Biografía Artística
                  </label>
                  <TextArea
                    id="editProfileBio"
                    name="editProfileBio"
                    value={editProfileForm.editProfileBio}
                    onChange={handleInputChange}
                    placeholder="Comparte tu viaje artístico, inspiraciones, técnicas y visión creativa..."
                    rows={8}
                    fullWidth
                    maxLength={500}
                    className="ep-bio-textarea"
                  />
                  <div className="ep-bio-footer">
                    <div className="ep-char-counter">
                      <span className="ep-counter-current">{editProfileForm.editProfileBio.length}</span>
                      <span className="ep-counter-separator">/</span>
                      <span className="ep-counter-total">500</span>
                      <span className="ep-counter-label">caracteres</span>
                    </div>
                    <div className="ep-bio-hint">
                      <span className="ep-hint-icon">💫</span>
                      <span className="ep-hint-text">Tu biografía es tu carta de presentación</span>
                    </div>
                  </div>
                </div>

                <div className="ep-form-group ep-glow-group">
                  <label htmlFor="editProfileWebsite" className="ep-form-label">
                    <span className="ep-label-icon">🌐</span>
                    Galería Digital
                  </label>
                  <Input
                    id="editProfileWebsite"
                    name="editProfileWebsite"
                    value={editProfileForm.editProfileWebsite}
                    onChange={handleInputChange}
                    placeholder="https://tu-galeria-creativa.com"
                    fullWidth
                    className="ep-glow-input"
                  />
                  <div className="ep-form-hint">
                    <span className="ep-hint-icon">🔗</span>
                    Enlace a tu portafolio, Behance, ArtStation, etc.
                  </div>
                </div>
              </div>

              <div className="ep-form-section ep-preferences-section">
                <div className="ep-section-header">
                  <div className="ep-section-icon">🎭</div>
                  <h3 className="ep-section-title">Tu Estilo Creativo</h3>
                </div>
                
                <div className="ep-preferences-grid">
                  <div className="ep-preference-card ep-style-card">
                    <div className="ep-preference-icon">🎯</div>
                    <div className="ep-preference-content">
                      <label className="ep-preference-label">Medio Principal</label>
                      <select 
                        value={editProfilePreferences.editProfileStyle}
                        onChange={(e) => handlePreferenceChange('editProfileStyle', e.target.value)}
                        className="ep-style-select"
                      >
                        <option value="Digital">🎨 Arte Digital</option>
                        <option value="Traditional">🖌️ Tradicional</option>
                        <option value="Mixed">✨ Mixto</option>
                        <option value="Photography">📸 Fotografía</option>
                        <option value="Illustration">✏️ Ilustración</option>
                        <option value="3D">🔄 3D</option>
                      </select>
                    </div>
                  </div>

                  <div className="ep-preference-card ep-specialties-card">
                    <div className="ep-preference-icon">🌈</div>
                    <div className="ep-preference-content">
                      <label className="ep-preference-label">Especialidades</label>
                      <div className="ep-tags-container">
                        <input 
                          type="text" 
                          placeholder="Añade tu especialidad y presiona Enter"
                          onKeyPress={handleAddSpecialty}
                          className="ep-tags-input"
                        />
                        <div className="ep-tags-list">
                          {editProfilePreferences.editProfileSpecialties.map((specialty, index) => (
                            <span key={index} className="ep-tag">
                              {specialty}
                              <button 
                                onClick={() => handleRemoveSpecialty(specialty)}
                                className="ep-tag-remove"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ep-form-section ep-privacy-section">
                <div className="ep-section-header">
                  <div className="ep-section-icon">🔐</div>
                  <h3 className="ep-section-title">Tu Santuario Creativo</h3>
                </div>
                
                <div className="ep-privacy-options">
                  <div className="ep-privacy-card">
                    <div className="ep-privacy-toggle">
                      <input 
                        type="checkbox" 
                        id="editProfilePublic"
                        checked={editProfilePreferences.editProfilePrivacy.editProfilePublic}
                        onChange={() => handlePrivacyChange('editProfilePublic')}
                        className="ep-privacy-checkbox"
                      />
                      <label htmlFor="editProfilePublic" className="ep-privacy-label">
                        <div className="ep-privacy-icon">🌍</div>
                        <div className="ep-privacy-text">
                          <span className="ep-privacy-title">Galería Pública</span>
                          <span className="ep-privacy-desc">Tu perfil será visible para toda la comunidad</span>
                        </div>
                      </label>
                      <div className="ep-toggle-switch"></div>
                    </div>
                  </div>

                  <div className="ep-privacy-card">
                    <div className="ep-privacy-toggle">
                      <input 
                        type="checkbox" 
                        id="editProfileStats"
                        checked={editProfilePreferences.editProfilePrivacy.editProfileStats}
                        onChange={() => handlePrivacyChange('editProfileStats')}
                        className="ep-privacy-checkbox"
                      />
                      <label htmlFor="editProfileStats" className="ep-privacy-label">
                        <div className="ep-privacy-icon">📊</div>
                        <div className="ep-privacy-text">
                          <span className="ep-privacy-title">Mostrar Estadísticas</span>
                          <span className="ep-privacy-desc">Compartir tu progreso artístico</span>
                        </div>
                      </label>
                      <div className="ep-toggle-switch"></div>
                    </div>
                  </div>

                  <div className="ep-privacy-card">
                    <div className="ep-privacy-toggle">
                      <input 
                        type="checkbox" 
                        id="editProfileMessages"
                        checked={editProfilePreferences.editProfilePrivacy.editProfileMessages}
                        onChange={() => handlePrivacyChange('editProfileMessages')}
                        className="ep-privacy-checkbox"
                      />
                      <label htmlFor="editProfileMessages" className="ep-privacy-label">
                        <div className="ep-privacy-icon">💌</div>
                        <div className="ep-privacy-text">
                          <span className="ep-privacy-title">Mensajes Creativos</span>
                          <span className="ep-privacy-desc">Recibir inspiración de otros artistas</span>
                        </div>
                      </label>
                      <div className="ep-toggle-switch"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción creativos */}
          <div className="ep-form-actions">
            <div className="ep-action-buttons">
              <Button 
                type="button" 
                variant="glass" 
                onClick={handleCancel}
                disabled={loading}
                className="ep-action-cancel"
              >
                <span className="ep-action-icon">🚫</span>
                <span className="ep-action-text">Cancelar</span>
              </Button>
              
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => navigate('/user/profile')}
                disabled={loading}
                className="ep-action-preview"
              >
                <span className="ep-action-icon">👁️</span>
                <span className="ep-action-text">Vista Previa</span>
              </Button>
              
              <Button 
                type="submit" 
                variant="gradient"
                disabled={loading}
                className="ep-action-save"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" className="ep-loading-spinner" />
                    <span className="ep-action-text">Guardando Tu Esencia...</span>
                  </>
                ) : (
                  <>
                    <span className="ep-action-icon">✨</span>
                    <span className="ep-action-text">Guardar Transformación</span>
                    <div className="ep-action-glow"></div>
                  </>
                )}
              </Button>
            </div>
            
            <div className="ep-form-tips">
              <div className="ep-tip-item">
                <span className="ep-tip-icon">💡</span>
                <span className="ep-tip-text">Tu perfil es tu galería personal</span>
              </div>
              <div className="ep-tip-item">
                <span className="ep-tip-icon">🎯</span>
                <span className="ep-tip-text">Sé auténtico y creativo</span>
              </div>
            </div>
          </div>
        </form>
      </Card>

      {/* Zona de acciones importantes */}
      <Card className="ep-important-zone">
        <div className="ep-important-header">
          <div className="ep-important-icon">⚠️</div>
          <div className="ep-important-content">
            <h3 className="ep-important-title">Acciones Importantes</h3>
            <p className="ep-important-subtitle">Decisiones que requieren atención especial</p>
          </div>
          <div className="ep-important-warning">
            <span className="ep-warning-icon">❗</span>
            <span className="ep-warning-text">Estas acciones no se pueden deshacer</span>
          </div>
        </div>
        
        <div className="ep-important-actions">
          <div className="ep-important-action ep-danger-action">
            <div className="ep-action-content">
              <div className="ep-action-icon">🗑️</div>
              <div className="ep-action-info">
                <h4 className="ep-action-title">Reiniciar Tu Galería</h4>
                <p className="ep-action-desc">Eliminar todas tus obras publicadas</p>
              </div>
            </div>
            <Button 
              variant="outline"
              className="ep-action-btn ep-danger-btn"
              onClick={() => {
                if (window.confirm('¿Estás seguro de querer eliminar todas tus obras? Esta acción es permanente.')) {
                  alert('Funcionalidad en desarrollo');
                }
              }}
            >
              Limpiar Galería
            </Button>
          </div>

          <div className="ep-important-action ep-critical-action">
            <div className="ep-action-content">
              <div className="ep-action-icon">🔥</div>
              <div className="ep-action-info">
                <h4 className="ep-action-title">Eliminar Tu Cuenta</h4>
                <p className="ep-action-desc">Tu cuenta y todo tu contenido serán eliminados permanentemente</p>
              </div>
            </div>
            <Button 
              variant="danger"
              className="ep-action-btn ep-critical-btn"
              onClick={() => {
                if (window.confirm('¿ESTÁS ABSOLUTAMENTE SEGURO? Esta acción eliminará tu cuenta y todo tu contenido de forma permanente e irreversible.')) {
                  alert('Funcionalidad de eliminar cuenta en desarrollo');
                }
              }}
            >
              Eliminar Mi Legado
            </Button>
          </div>
        </div>
      </Card>

      {/* Pie de página decorativo */}
      <div className="ep-footer">
        <div className="ep-footer-content">
          <div className="ep-footer-text">
            <span className="ep-footer-icon">🎨</span>
            <span className="ep-footer-message">Tu creatividad define tu perfil</span>
          </div>
          <div className="ep-footer-decorations">
            <span className="ep-footer-dot"></span>
            <span className="ep-footer-dot"></span>
            <span className="ep-footer-dot"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;