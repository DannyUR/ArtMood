// services/commentService.js
import api from './api';

export const commentService = {
  // Obtener comentarios de una obra
  getByObra: async (idObra) => {
    console.log(`📥 Obteniendo comentarios para obra ${idObra}`);
    try {
      const response = await api.get(`/works/${idObra}/comments`);
      console.log('📨 Comentarios recibidos:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo comentarios:', error);
      throw error;
    }
  },

  // Crear comentario - CORREGIDO para usar 'content'
  create: async (commentData) => {
    console.log('📤 Creando comentario:', commentData);
    
    // Tu API espera 'content', no 'contenido'
    const laravelData = {
      content: commentData.content, // Cambiado a 'content'
      id_usuario: commentData.id_usuario,
      id_obra: commentData.id_obra
    };
    
    console.log('📤 Datos para Laravel:', laravelData);
    
    try {
      const response = await api.post('/comments', laravelData);
      console.log('✅ Comentario creado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creando comentario:', error);
      throw error;
    }
  },

  // Eliminar comentario
  delete: async (idComentario) => {
    console.log(`🗑️ Eliminando comentario ${idComentario}`);
    try {
      const response = await api.delete(`/comments/${idComentario}`);
      console.log('✅ Comentario eliminado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando comentario:', error);
      throw error;
    }
  },

  // Actualizar comentario
  update: async (idComentario, commentData) => {
    console.log(`✏️ Actualizando comentario ${idComentario}:`, commentData);
    
    const laravelData = {
      content: commentData.content
    };
    
    try {
      const response = await api.put(`/comments/${idComentario}`, laravelData);
      console.log('✅ Comentario actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error actualizando comentario:', error);
      throw error;
    }
  }
};