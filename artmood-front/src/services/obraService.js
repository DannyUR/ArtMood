import api from './api';

export const obraService = {
  // Obtener todas las obras
  getAll: async () => {
    const response = await api.get('/works');
    return response.data.data; // Extraemos el array de obras del response
  },

  // Obtener una obra por ID
  getById: async (id) => {
    const response = await api.get(`/works/${id}`);
    return response.data.data;
  },

  // Crear obra
  create: async (obraData) => {
    const response = await api.post('/works', obraData);
    return response.data;
  },

  // Actualizar obra
  update: async (id, obraData) => {
    const response = await api.put(`/works/${id}`, obraData);
    return response.data;
  },

  // Eliminar obra
  delete: async (id) => {
    const response = await api.delete(`/works/${id}`);
    return response.data;
  }
};