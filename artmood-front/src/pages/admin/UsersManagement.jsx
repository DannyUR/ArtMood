import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import './UsersManagement.css';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    nickname: '',
    email: '',
    role: 'user'
  });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getAll();
      setUsers(usersData);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setError('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`¿Estás seguro de eliminar al usuario "${userName}"?`)) {
      try {
        await userService.delete(userId);
        setUsers(users.filter(user => user.id_usuario !== userId));
        alert('Usuario eliminado correctamente');
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar el usuario');
      }
    }
  };

  // Función para abrir modal de edición
  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      role: user.role
    });
  };

  // Función para cerrar modal de edición
  const closeEditModal = () => {
    setEditingUser(null);
    setEditFormData({ name: '', nickname: '', email: '', role: 'user' });
    setError('');
  };

  // Función para guardar cambios del usuario
  const handleUpdateUser = async (e) => {
    e.preventDefault();

    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      setError('Nombre y email son obligatorios');
      return;
    }

    setEditLoading(true);
    setError('');

    try {
      const updatedUser = await userService.update(editingUser.id_usuario, editFormData);

      // Actualizar la lista de usuarios
      setUsers(users.map(user =>
        user.id_usuario === editingUser.id_usuario
          ? { ...user, ...updatedUser.data }
          : user
      ));

      closeEditModal();
      alert('Usuario actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        'Error al actualizar el usuario';
      setError(errorMessage);
    } finally {
      setEditLoading(false);
    }
  };

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="am-users-loading-container">
        <div className="am-users-spinner"></div>
        <p className="am-users-loading-text">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="am-users-container">
      {/* Encabezado */}
      <div className="am-users-header">
        <div className="am-users-header-content">
          <h1 className="am-users-title">
            <span className="am-users-title-icon">👥</span>
            Gestión de Usuarios
          </h1>
          <p className="am-users-subtitle">
            Administra los <span className="am-users-count">{users.length}</span> usuarios registrados en ArtMood
          </p>
        </div>
        <div className="am-users-header-decorations">
          <div className="am-users-dot am-users-dot-1"></div>
          <div className="am-users-dot am-users-dot-2"></div>
          <div className="am-users-dot am-users-dot-3"></div>
        </div>
      </div>

      {/* Panel informativo */}
      <div className="am-users-alert">
        <div className="am-users-alert-icon">ℹ️</div>
        <div className="am-users-alert-content">
          <h3 className="am-users-alert-title">Permisos de administrador</h3>
          <p className="am-users-alert-text">
            Como administrador, puedes gestionar usuarios, cambiar roles y eliminar cuentas.
            <br />
            <span className="am-users-alert-highlight">
              ¡Sé cuidadoso con los cambios que realizas!
            </span>
          </p>
        </div>
      </div>

      {/* Filtros y búsqueda */}
      <div className="am-users-filters">
        <div className="am-users-search">
          <div className="am-users-search-icon">🔍</div>
          <input
            type="text"
            placeholder="Buscar usuarios por nombre, nickname o email..."
            className="am-users-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="am-users-filter-group">
          <select
            className="am-users-filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Todos los roles</option>
            <option value="user">Usuarios</option>
            <option value="admin">Administradores</option>
          </select>
          
          <button 
            className="am-users-refresh-btn"
            onClick={loadUsers}
          >
            <span className="am-users-refresh-icon">🔄</span>
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="am-users-stats-grid">
        <div className="am-users-stat-card am-users-stat-total">
          <div className="am-users-stat-icon">👥</div>
          <div className="am-users-stat-content">
            <h3 className="am-users-stat-number">{users.length}</h3>
            <p className="am-users-stat-label">Total Usuarios</p>
            <div className="am-users-stat-trend">+12% este mes</div>
          </div>
        </div>

        <div className="am-users-stat-card am-users-stat-artists">
          <div className="am-users-stat-icon">🎨</div>
          <div className="am-users-stat-content">
            <h3 className="am-users-stat-number">
              {users.filter(user => user.role === 'user').length}
            </h3>
            <p className="am-users-stat-label">Artistas</p>
            <div className="am-users-stat-trend">Activos</div>
          </div>
        </div>

        <div className="am-users-stat-card am-users-stat-admins">
          <div className="am-users-stat-icon">🛡️</div>
          <div className="am-users-stat-content">
            <h3 className="am-users-stat-number">
              {users.filter(user => user.role === 'admin').length}
            </h3>
            <p className="am-users-stat-label">Administradores</p>
            <div className="am-users-stat-trend">Con privilegios</div>
          </div>
        </div>

        <div className="am-users-stat-card am-users-stat-new">
          <div className="am-users-stat-icon">🆕</div>
          <div className="am-users-stat-content">
            <h3 className="am-users-stat-number">
              {users.filter(user => {
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return new Date(user.fecha_registro) > monthAgo;
              }).length}
            </h3>
            <p className="am-users-stat-label">Nuevos (mes)</p>
            <div className="am-users-stat-trend">Creciendo</div>
          </div>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="am-users-list-container">
        <div className="am-users-list-header">
          <h2 className="am-users-list-title">
            <span className="am-users-list-title-icon">📋</span>
            Lista de Usuarios
            <span className="am-users-list-count">({filteredUsers.length})</span>
          </h2>
          <div className="am-users-list-summary">
            Mostrando {filteredUsers.length} de {users.length} usuarios
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="am-users-empty-state">
            <div className="am-users-empty-icon">👤</div>
            <h3 className="am-users-empty-title">No se encontraron usuarios</h3>
            <p className="am-users-empty-text">
              {searchTerm || filterRole !== 'all' 
                ? 'Intenta con otros términos de búsqueda o filtros'
                : 'Los usuarios aparecerán aquí cuando se registren'}
            </p>
          </div>
        ) : (
          <div className="am-users-grid">
            {filteredUsers.map((user) => (
              <div key={user.id_usuario} className="am-user-card">
                {/* Avatar y badge */}
                <div className="am-user-header">
                  <div className="am-user-avatar-container">
                    {user.profile_photo ? (
                      <img
                        className="am-user-avatar"
                        src={`http://localhost:8000/storage/${user.profile_photo}`}
                        alt={user.name}
                      />
                    ) : (
                      <div className="am-user-avatar-placeholder">
                        <span className="am-user-avatar-initial">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className={`am-user-status ${user.role === 'admin' ? 'am-user-status-admin' : 'am-user-status-user'}`}></div>
                  </div>
                  
                  <div className="am-user-badge">
                    <span className={`am-user-role ${user.role === 'admin' ? 'am-user-role-admin' : 'am-user-role-user'}`}>
                      {user.role === 'admin' ? '🛡️ Admin' : '🎨 Artista'}
                    </span>
                  </div>
                </div>

                {/* Información principal */}
                <div className="am-user-content">
                  <h3 className="am-user-name" title={user.name}>
                    {user.name}
                  </h3>
                  
                  <div className="am-user-nickname">
                    <span className="am-user-nickname-icon">@</span>
                    <span className="am-user-nickname-text">{user.nickname}</span>
                  </div>
                  
                  <p className="am-user-email" title={user.email}>
                    {user.email}
                  </p>
                </div>

                {/* Detalles adicionales */}
                <div className="am-user-details">
                  <div className="am-user-detail">
                    <span className="am-user-detail-label">📅 Registro:</span>
                    <span className="am-user-detail-value">
                      {new Date(user.fecha_registro).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="am-user-detail">
                    <span className="am-user-detail-label">🆔 ID:</span>
                    <span className="am-user-detail-value">#{user.id_usuario}</span>
                  </div>
                  
                  {user.telefono && (
                    <div className="am-user-detail">
                      <span className="am-user-detail-label">📱 Tel:</span>
                      <span className="am-user-detail-value">{user.telefono}</span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="am-user-actions">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="am-user-action-btn am-user-action-edit"
                  >
                    <span className="am-user-action-icon">✏️</span>
                    Editar
                  </button>
                  
                  <button
                    onClick={() => handleDeleteUser(user.id_usuario, user.name)}
                    className="am-user-action-btn am-user-action-delete"
                  >
                    <span className="am-user-action-icon">🗑️</span>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      {editingUser && (
        <div className="am-user-modal-overlay">
          <div className="am-user-modal">
            <div className="am-user-modal-header">
              <h3 className="am-user-modal-title">
                <span className="am-user-modal-icon">✏️</span>
                Editar Usuario
              </h3>
              <button
                onClick={closeEditModal}
                className="am-user-modal-close"
                disabled={editLoading}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="am-user-modal-form">
              <div className="am-user-modal-avatar">
                {editingUser.profile_photo ? (
                  <img
                    className="am-user-modal-avatar-img"
                    src={`http://localhost:8000/storage/${editingUser.profile_photo}`}
                    alt={editingUser.name}
                  />
                ) : (
                  <div className="am-user-modal-avatar-placeholder">
                    <span className="am-user-modal-avatar-initial">
                      {editingUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="am-user-modal-avatar-info">
                  <span className="am-user-modal-avatar-name">{editingUser.name}</span>
                  <span className="am-user-modal-avatar-nickname">@{editingUser.nickname}</span>
                </div>
              </div>

              <div className="am-user-modal-fields">
                <div className="am-user-form-group">
                  <label className="am-user-form-label">
                    <span className="am-user-form-icon">👤</span>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="am-user-form-input"
                    required
                    disabled={editLoading}
                    placeholder="Ingrese el nombre completo"
                  />
                </div>

                <div className="am-user-form-group">
                  <label className="am-user-form-label">
                    <span className="am-user-form-icon">🏷️</span>
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    value={editFormData.nickname}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, nickname: e.target.value }))}
                    className="am-user-form-input"
                    required
                    disabled={editLoading}
                    placeholder="Ingrese el nickname"
                  />
                </div>

                <div className="am-user-form-group">
                  <label className="am-user-form-label">
                    <span className="am-user-form-icon">📧</span>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="am-user-form-input"
                    required
                    disabled={editLoading}
                    placeholder="usuario@ejemplo.com"
                  />
                </div>

                <div className="am-user-form-group">
                  <label className="am-user-form-label">
                    <span className="am-user-form-icon">👑</span>
                    Rol
                  </label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, role: e.target.value }))}
                    className="am-user-form-select"
                    disabled={editLoading}
                  >
                    <option value="user">🎨 Usuario</option>
                    <option value="admin">🛡️ Administrador</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="am-user-modal-error">
                  <span className="am-user-modal-error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="am-user-modal-actions">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="am-user-modal-btn am-user-modal-btn-cancel"
                  disabled={editLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="am-user-modal-btn am-user-modal-btn-save"
                >
                  {editLoading ? (
                    <>
                      <span className="am-user-modal-loading"></span>
                      Guardando...
                    </>
                  ) : (
                    'Guardar Cambios'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mensaje de error general */}
      {error && !editingUser && (
        <div className="am-users-error">
          <div className="am-users-error-icon">❌</div>
          <p className="am-users-error-text">{error}</p>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;