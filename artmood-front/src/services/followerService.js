// services/followerService.js
import api from './api';

export const followerService = {
  // Seguir a un usuario
  follow: async (idSeguido) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const data = {
        id_seguidor: user.id,
        id_seguido: idSeguido
      };
      
      console.log('📤 Siguiendo usuario:', data);
      const response = await api.post('/followers', data);
      console.log('✅ Usuario seguido:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error siguiendo usuario:', error);
      throw error;
    }
  },

  // Dejar de seguir (eliminar relación) - CORREGIDO para tu API
  unfollow: async (idSeguido) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      
      // Tu API espera parámetros en la URL: /followers/{id_seguidor}/{id_seguido}
      const response = await api.delete(`/followers/${user.id}/${idSeguido}`);
      console.log('✅ Dejaste de seguir al usuario:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error dejando de seguir:', error);
      throw error;
    }
  },

  // Obtener seguidores de un usuario
  getFollowers: async (userId) => {
    try {
      const response = await api.get(`/followers/${userId}/followers`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo seguidores:', error);
      throw error;
    }
  },

  // Obtener usuarios que sigue
  getFollowing: async (userId) => {
    try {
      const response = await api.get(`/followers/${userId}/following`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo seguidos:', error);
      throw error;
    }
  },

  // Verificar si sigue a un usuario
  checkFollow: async (idSeguido) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const following = await followerService.getFollowing(user.id);
      
      return following.data.some(follow => 
        follow.id_seguido === idSeguido || 
        follow.seguido?.id_usuario === idSeguido
      );
    } catch (error) {
      console.error('❌ Error verificando seguimiento:', error);
      return false;
    }
  }
};