// utils/constants.js

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Estados de comentarios
export const COMMENT_STATUS = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  DELETED: 'eliminado'
};

// Tipos de notificaciones
export const NOTIFICATION_TYPES = {
  COMMENT: 'comentario',
  REACTION: 'reaccion',
  FOLLOW: 'seguimiento',
  SYSTEM: 'sistema'
};

// Emociones predefinidas (puedes sincronizar con tu base de datos)
export const DEFAULT_EMOTIONS = [
  { id: 1, nombre: 'Felicidad', icono: '😊' },
  { id: 2, nombre: 'Tristeza', icono: '😢' },
  { id: 3, nombre: 'Enojo', icono: '😠' },
  { id: 4, nombre: 'Miedo', icono: '😨' },
  { id: 5, nombre: 'Sorpresa', icono: '😮' },
  { id: 6, nombre: 'Calma', icono: '😌' },
  { id: 7, nombre: 'Amor', icono: '❤️' },
  { id: 8, nombre: 'Inspiración', icono: '💡' }
];

// Reacciones disponibles
export const AVAILABLE_REACTIONS = ['❤️', '🔥', '⭐', '😮', '😢', '👍'];

// Configuración de la aplicación
export const APP_CONFIG = {
  NAME: 'ArtMood',
  VERSION: '1.0.0',
  API_BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  UPLOAD_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};