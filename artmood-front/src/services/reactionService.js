// services/reactionService.js
import api from './api';

export const reactionService = {
  // Obtener reacciones agrupadas por obra (nuevo método)
  getReactionsByWork: async (idObra) => {
    console.log(`📥 Obteniendo reacciones para obra ${idObra}`);
    try {
      const response = await api.get(`/works/${idObra}/reactions`);
      console.log('✅ Reacciones obtenidas:', response.data);
      return response.data.data; // Acceder a .data porque la respuesta tiene {status, data}
    } catch (error) {
      console.error('❌ Error obteniendo reacciones:', error.response?.data || error.message);
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
      console.error('❌ Error creando reacción:', error.response?.data || error.message);
      
      // Manejar error específico de duplicado
      if (error.response?.status === 400) {
        throw new Error('Ya has reaccionado con este emoji');
      }
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
      console.error('❌ Error eliminando reacción:', error.response?.data || error.message);
      throw error;
    }
  },

  // Obtener todas las reacciones (para admin)
  getAll: async () => {
    try {
      const response = await api.get('/reactions');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo todas las reacciones:', error);
      throw error;
    }
  }

  
};