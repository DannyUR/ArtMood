// services/followerService.js (ACTUALIZADO)
import api from './api';

export const followerService = {
  // Seguir a un usuario
  follow: async (idSeguido) => {
    try {
      const response = await api.post(`/follow/${idSeguido}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error siguiendo usuario:', error);
      throw error;
    }
  },

  // Dejar de seguir
  unfollow: async (idSeguido) => {
    try {
      const response = await api.delete(`/unfollow/${idSeguido}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error dejando de seguir:', error);
      throw error;
    }
  },

  // Obtener seguidores de un usuario
  getFollowers: async (userId) => {
    try {
      const response = await api.get(`/followers/${userId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo seguidores:', error);
      throw error;
    }
  },

  // Obtener usuarios que sigue
  getFollowing: async (userId) => {
    try {
      const response = await api.get(`/following/${userId}`);
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