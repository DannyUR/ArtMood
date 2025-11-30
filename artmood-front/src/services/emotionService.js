import api from './api';

export const emotionService = {
  // Obtener todas las emociones
  getAll: async () => {
    const response = await api.get('/emotions');
    return response.data;
  },

  // Obtener emoción por ID
  getById: async (id) => {
    const response = await api.get(`/emotions/${id}`);
    return response.data;
  },

  // Crear emoción
  create: async (emotionData) => {
    const response = await api.post('/emotions', emotionData);
    return response.data;
  },

  // Actualizar emoción
  update: async (id, emotionData) => {
    const response = await api.put(`/emotions/${id}`, emotionData);
    return response.data;
  },

  // Eliminar emoción
  delete: async (id) => {
    const response = await api.delete(`/emotions/${id}`);
    return response.data;
  }
};