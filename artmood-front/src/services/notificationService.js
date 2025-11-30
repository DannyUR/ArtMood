// services/notificationService.js
import api from './api';

export const notificationService = {
  // Obtener todas las notificaciones del usuario
  getAll: async () => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      console.error('❌ Error obteniendo notificaciones:', error);
      throw error;
    }
  },

  // Marcar todas las notificaciones como leídas
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/read');
      return response.data;
    } catch (error) {
      console.error('❌ Error marcando todas como leídas:', error);
      throw error;
    }
  },

  // Eliminar una notificación
  delete: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error eliminando notificación:', error);
      throw error;
    }
  },

  // Eliminar todas las notificaciones (si necesitas esta funcionalidad)
  deleteAll: async () => {
    try {
      // Como no tienes endpoint para eliminar todas, simulamos eliminando una por una
      const notifications = await notificationService.getAll();
      const deletePromises = notifications.data.map(notif => 
        notificationService.delete(notif.id_notificacion)
      );
      await Promise.all(deletePromises);
      return { status: 'success', message: 'Todas las notificaciones eliminadas' };
    } catch (error) {
      console.error('❌ Error eliminando todas las notificaciones:', error);
      throw error;
    }
  }
};