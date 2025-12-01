// utils/helpers.js

// Formatear fecha
export const formatDate = (dateString) => {
  if (!dateString) return 'Fecha no disponible';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha no disponible';
  }
};

// Validar email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar imagen
export const isValidImage = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de archivo no permitido. Use JPEG, PNG, GIF o WebP.');
  }
  
  if (file.size > maxSize) {
    throw new Error('La imagen no debe superar los 5MB.');
  }
  
  return true;
};

// Recortar texto
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generar placeholder para imagen
export const getImagePlaceholder = (width = 300, height = 200, text = 'ArtMood') => {
  return `https://via.placeholder.com/${width}x${height}/6200ee/ffffff?text=${encodeURIComponent(text)}`;
};

// Capitalizar texto
export const capitalize = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Obtener iniciales
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Manejar errores de API
export const handleApiError = (error) => {
  if (error.response) {
    // Error del servidor
    const message = error.response.data.message || 'Error del servidor';
    const errors = error.response.data.errors;
    
    if (errors) {
      return Object.values(errors).flat().join(', ');
    }
    
    return message;
  } else if (error.request) {
    // Error de red
    return 'Error de conexión. Verifique su internet.';
  } else {
    // Error inesperado
    return 'Error inesperado. Intente nuevamente.';
  }
};

// Debounce para búsquedas
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// LocalStorage helpers
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

