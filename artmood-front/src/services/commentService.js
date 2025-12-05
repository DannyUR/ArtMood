import api from './api'; // Asegúrate de tener tu configuración de axios aquí

// 1. Obtener comentarios por obra
const getByObra = async (obraId) => {
    try {
        const response = await api.get(`/comments/obra/${obraId}`);
        return response.data;
    } catch (error) {
        console.error('Error en getByObra:', error);
        throw error;
    }
};

// 2. Crear un nuevo comentario
const create = async (commentData) => {
    try {
        const dataToSend = {
            ...commentData,
            status: 'visible'
        };
        const response = await api.post('/comments', dataToSend);
        return response.data;
    } catch (error) {
        console.error('Error en create:', error);
        throw error;
    }
};

// 3. ACTUALIZAR un comentario (NUEVO - para editar)
const update = async (id, data) => {
    try {
        const response = await api.put(`/comments/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error en update:', error);
        throw error;
    }
};

// 4. Eliminar un comentario
const deleteComment = async (id) => {
    try {
        const response = await api.delete(`/comments/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error en deleteComment:', error);
        throw error;
    }
};

// Exporta todo como un objeto
const commentService = {
    getByObra,
    create,
    update,      // ← Esto es lo nuevo que agregas
    delete: deleteComment
};

export default commentService;