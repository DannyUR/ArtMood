// components/notifications/NotificationBell.jsx (ACTUALIZADO)
import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { useAuth } from '../../context/AuthContext';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getAll();
      setNotifications(response.data);
      
      // Contar no leídas (asumiendo que tienes campo 'leida' en tu modelo)
      const unread = response.data.filter(notif => !notif.leida).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.delete(notificationId);
      await loadNotifications();
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  const getNotificationIcon = (tipo) => {
    const icons = {
      comentario: '💬',
      reaccion: '❤️',
      seguimiento: '👤',
      sistema: '🔔'
    };
    return icons[tipo] || '🔔';
  };

  return (
    <div className="notification-bell">
      <button 
        className="bell-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        🔔
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notificaciones</h4>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="btn-mark-all">
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.slice(0, 10).map(notif => (
              <div 
                key={notif.id_notificacion} 
                className={`notification-item ${!notif.leida ? 'unread' : ''}`}
              >
                <span className="notification-icon">
                  {getNotificationIcon(notif.tipo)}
                </span>
                <div className="notification-content">
                  <p className="notification-message">{notif.mensaje}</p>
                  <span className="notification-time">
                    {new Date(notif.fecha).toLocaleDateString()}
                  </span>
                </div>
                <button 
                  onClick={() => deleteNotification(notif.id_notificacion)}
                  className="btn-delete-notification"
                  title="Eliminar notificación"
                >
                  ×
                </button>
              </div>
            ))}
            
            {notifications.length === 0 && (
              <p className="no-notifications">No hay notificaciones</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;