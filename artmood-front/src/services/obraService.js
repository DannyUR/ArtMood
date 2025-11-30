import api from './api';

export const obraService = {
  // Obtener todas las obras
  getAll: async () => {
    const response = await api.get('/works');
    return response.data.data;
  },

  // Obtener una obra por ID
  getById: async (id) => {
    const response = await api.get(`/works/${id}`);
    return response.data.data;
  },

  // Crear obra (ahora soporta FormData para imágenes)
  create: async (obraData) => {
    // Si es FormData (con imagen), no configurar headers
    if (obraData instanceof FormData) {
      const response = await api.post('/works', obraData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Si es JSON normal
      const response = await api.post('/works', obraData);
      return response.data;
    }
  },

  // Actualizar obra (soporta FormData para imágenes)
  update: async (id, obraData) => {
    // Si es FormData (con imagen), no configurar headers
    if (obraData instanceof FormData) {
      const response = await api.post(`/works/${id}`, obraData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      // Si es JSON normal
      const response = await api.put(`/works/${id}`, obraData);
      return response.data;
    }
  },

  // Eliminar obra
  delete: async (id) => {
    const response = await api.delete(`/works/${id}`);
    return response.data;
  }
};