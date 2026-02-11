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
    // Si es FormData (con imagen)
    if (obraData instanceof FormData) {
      // 🔴 IMPORTANTE: NO configurar 'Content-Type' manualmente
      // El navegador lo hará automáticamente con el boundary correcto
      const response = await api.post('/works', obraData);
      return response.data;
    } else {
      // Si es JSON normal
      const response = await api.post('/works', obraData);
      return response.data;
    }
  },

  // Actualizar obra (soporta FormData para imágenes)
  update: async (id, obraData) => {
    console.log('📤 obraService.update llamado:', {
      id,
      esFormData: obraData instanceof FormData,
      tieneImage: obraData instanceof FormData ? 
        obraData.has('image') : 'N/A'
    });
    
    // Si es FormData (con imagen)
    if (obraData instanceof FormData) {
      // 🔴 CRÍTICO: NO configurar 'Content-Type' manualmente
      // También usar POST con _method=PUT para Laravel
      
      // Verificar contenido del FormData
      console.log('📦 Contenido de FormData:');
      for (let pair of obraData.entries()) {
        console.log(`  ${pair[0]}:`, pair[1] instanceof File ? 
          `File(${pair[1].name}, ${pair[1].type})` : 
          pair[1]);
      }
      
      try {
        // Usar POST con _method=PUT para Laravel
        const response = await api.post(`/works/${id}`, obraData);
        console.log('✅ Update exitoso:', response.data);
        return response.data;
      } catch (error) {
        console.error('❌ Error en update con FormData:', error.response?.data || error.message);
        throw error;
      }
    } else {
      // Si es JSON normal
      console.log('📄 Enviando como JSON:', obraData);
      try {
        const response = await api.put(`/works/${id}`, obraData);
        return response.data;
      } catch (error) {
        console.error('❌ Error en update con JSON:', error.response?.data || error.message);
        throw error;
      }
    }
  },

  // 🔴 NUEVO: Método específico para actualizar con FormData (alternativa)
  updateWithImage: async (id, formData) => {
    console.log('🖼️ updateWithImage llamado para obra:', id);
    
    // Asegurar que _method=PUT está incluido
    if (!formData.has('_method')) {
      formData.append('_method', 'PUT');
    }
    
    // Debug del FormData
    console.log('📋 Contenido final de FormData:');
    for (let pair of formData.entries()) {
      const [key, value] = pair;
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    // Usar fetch directamente para más control
    try {
      const response = await fetch(`http://localhost:8000/api/works/${id}`, {
        method: 'POST',
        body: formData,
        // 🔴 NO establecer Content-Type aquí
        headers: {
          'Accept': 'application/json',
          // Incluir token si es necesario
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        }
      });
      
      const data = await response.json();
      console.log('📥 Respuesta fetch:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Error del servidor');
      }
      
      return { data };
    } catch (error) {
      console.error('❌ Error en fetch:', error);
      throw error;
    }
  },

  // Eliminar obra
  delete: async (id) => {
    const response = await api.delete(`/works/${id}`);
    return response.data;
  },

  // ... (mantén el resto de los métodos igual)
  getMyObras: async () => {
    try {
      const allWorks = await obraService.getAll();
      const user = JSON.parse(localStorage.getItem('user'));
      const myWorks = allWorks.filter(work => work.id_usuario === user.id);
      return { status: 'success', data: myWorks };
    } catch (error) {
      console.error('❌ Error obteniendo mis obras:', error);
      throw error;
    }
  },

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

  getPopular: async () => {
    try {
      const allWorks = await obraService.getAll();
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