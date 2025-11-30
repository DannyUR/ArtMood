// services/reactionService.js
import api from './api';

export const reactionService = {
  // Obtener reacciones de una obra
  getByObra: async (idObra) => {
    try {
      const response = await api.get(`/works/${idObra}/reactions`);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo reacciones:', error);
      throw error;
    }
  },

  // Agregar reacción
  create: async (reactionData) => {
    console.log('📤 Creando reacción:', reactionData);
    try {
      const response = await api.post('/reactions', reactionData);
      console.log('✅ Reacción creada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando reacción:', error);
      throw error;
    }
  },

  // Eliminar reacción por ID
  delete: async (idReaccion) => {
    console.log(`🗑️ Eliminando reacción ${idReaccion}`);
    try {
      const response = await api.delete(`/reactions/${idReaccion}`);
      console.log('✅ Reacción eliminada:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando reacción:', error);
      throw error;
    }
  },

  // Eliminar reacción por obra y usuario (método alternativo)
  deleteByObraAndUser: async (idObra, idUsuario) => {
    try {
      // Primero obtener todas las reacciones del usuario en esa obra
      const reacciones = await reactionService.getByObra(idObra);
      const reaccionUsuario = reacciones.data.find(
        r => r.id_usuario === idUsuario
      );
      
      if (reaccionUsuario) {
        return await reactionService.delete(reaccionUsuario.id_reaccion);
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error eliminando reacción:', error);
      throw error;
    }
  }
};