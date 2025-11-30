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
  },

  // Obtener obras del usuario actual (usando el perfil del usuario logueado)
  getMyObras: async () => {
    try {
      // Podemos filtrar las obras del usuario actual
      const allWorks = await obraService.getAll();
      const user = JSON.parse(localStorage.getItem('user'));
      const myWorks = allWorks.filter(work => work.id_usuario === user.id);
      return { status: 'success', data: myWorks };
    } catch (error) {
      console.error('❌ Error obteniendo mis obras:', error);
      throw error;
    }
  },

  // Obtener obras por emoción (filtrando del lado del cliente por ahora)
  getByEmotion: async (emotionId) => {
    try {
      const allWorks = await obraService.getAll();
      const worksByEmotion = allWorks.filter(work => work.id_emocion === emotionId);
      return { status: 'success', data: worksByEmotion };
    } catch (error) {
      console.error('❌ Error obteniendo obras por emoción:', error);
      throw error;
    }
  },

  // Obtener obras por categoría (filtrando del lado del cliente por ahora)
  getByCategory: async (categoryId) => {
    try {
      const allWorks = await obraService.getAll();
      const worksByCategory = allWorks.filter(work => work.id_categoria === categoryId);
      return { status: 'success', data: worksByCategory };
    } catch (error) {
      console.error('❌ Error obteniendo obras por categoría:', error);
      throw error;
    }
  },

  // Obtener obras populares (por número de reacciones)
  getPopular: async () => {
    try {
      const allWorks = await obraService.getAll();
      // Ordenar por número de reacciones (necesitarías cargar reacciones primero)
      const worksWithReactions = await Promise.all(
        allWorks.map(async (work) => {
          try {
            const reactions = await api.get(`/works/${work.id_obra}/reactions`);
            return {
              ...work,
              reactionCount: reactions.data.data.length
            };
          } catch {
            return { ...work, reactionCount: 0 };
          }
        })
      );

      const popularWorks = worksWithReactions
        .sort((a, b) => b.reactionCount - a.reactionCount)
        .slice(0, 10);

      return { status: 'success', data: popularWorks };
    } catch (error) {
      console.error('❌ Error obteniendo obras populares:', error);
      throw error;
    }
  },

  // Obtener obras recientes
  getRecent: async () => {
    try {
      const allWorks = await obraService.getAll();
      const recentWorks = allWorks
        .sort((a, b) => new Date(b.fecha_publicacion) - new Date(a.fecha_publicacion))
        .slice(0, 20);
      return { status: 'success', data: recentWorks };
    } catch (error) {
      console.error('❌ Error obteniendo obras recientes:', error);
      throw error;
    }
  },

  // Buscar obras por término
  search: async (searchTerm) => {
    try {
      const allWorks = await obraService.getAll();
      const searchResults = allWorks.filter(work =>
        work.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        work.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return { status: 'success', data: searchResults };
    } catch (error) {
      console.error('❌ Error buscando obras:', error);
      throw error;
    }
  },

  // Feed de obras de usuarios que sigues
  getFeedSeguidos: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const followingResponse = await api.get(`/following/${user.id}`);
      const followingIds = followingResponse.data.data.map(f =>
        f.id_seguido || f.seguido?.id_usuario
      );

      const allWorks = await obraService.getAll();
      const feedWorks = allWorks.filter(work =>
        followingIds.includes(work.id_usuario)
      );

      return { status: 'success', data: feedWorks };
    } catch (error) {
      console.error('❌ Error obteniendo feed de seguidos:', error);
      throw error;
    }
  },

  // Obtener obras para descubrir (no seguidas)
  getDiscover: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const followingResponse = await api.get(`/following/${user.id}`);
      const followingIds = followingResponse.data.data.map(f =>
        f.id_seguido || f.seguido?.id_usuario
      );

      const allWorks = await obraService.getAll();
      const discoverWorks = allWorks.filter(work =>
        !followingIds.includes(work.id_usuario) && work.id_usuario !== user.id
      );

      return { status: 'success', data: discoverWorks };
    } catch (error) {
      console.error('❌ Error obteniendo descubrir:', error);
      throw error;
    }
  }

};