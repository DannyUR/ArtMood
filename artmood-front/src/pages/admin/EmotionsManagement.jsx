import React, { useState, useEffect } from 'react';
import { emotionService } from '../../services/emotionService';

const EmotionsManagement = () => {
  const [emotions, setEmotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEmotion, setEditingEmotion] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // Emojis sugeridos para emociones - puedes agregar los que quieras
  const suggestedEmojis = ['😊', '😢', '😠', '😍', '😮', '😴', '😂', '🥰', '😎', '🤔', '🙏', '💪', '✨', '🎨', '❤️', '🔥', '⭐', '🌙', '🌈', '🎭'];

  useEffect(() => {
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      setLoading(true);
      const emotionsData = await emotionService.getAll();
      setEmotions(emotionsData);
    } catch (error) {
      console.error('Error cargando emociones:', error);
      setError('Error al cargar las emociones');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmotion = async (emotionId, emotionName) => {
    if (window.confirm(`¿Estás seguro de eliminar la emoción "${emotionName}"?`)) {
      try {
        await emotionService.delete(emotionId);
        setEmotions(emotions.filter(emotion => emotion.id_emocion !== emotionId));
        alert('Emoción eliminada correctamente');
      } catch (error) {
        console.error('Error eliminando emoción:', error);
        alert('Error al eliminar la emoción');
      }
    }
  };

  const handleEditEmotion = (emotion) => {
    setEditingEmotion(emotion);
    setFormData({
      name: emotion.name,
      icon: emotion.icon
    });
  };

  const handleCreateEmotion = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre de la emoción es obligatorio');
      return;
    }

    if (!formData.icon.trim()) {
      setError('Debes seleccionar un emoji');
      return;
    }

    setFormLoading(true);
    setError('');

    try {
      const newEmotion = await emotionService.create(formData);
      setEmotions([...emotions, newEmotion]);
      setFormData({ name: '', icon: '' });
      setShowCreateForm(false);
      alert('Emoción creada correctamente');
    } catch (error) {
      console.error('Error creando emoción:', error);
      const errorMessage = error.response?.data?.message || 
                          'Error al crear la emoción';
      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateEmotion = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('El nombre de la emoción es obligatorio');
      return;
    }

    if (!formData.icon.trim()) {
      setError('Debes seleccionar un emoji');
      return;
    }

    setFormLoading(true);
    setError('');

    try {
      const updatedEmotion = await emotionService.update(editingEmotion.id_emocion, formData);
      
      // Actualizar la lista de emociones
      setEmotions(emotions.map(emotion => 
        emotion.id_emocion === editingEmotion.id_emocion 
          ? { ...emotion, ...updatedEmotion } 
          : emotion
      ));
      
      closeEditModal();
      alert('Emoción actualizada correctamente');
    } catch (error) {
      console.error('Error actualizando emoción:', error);
      const errorMessage = error.response?.data?.message || 
                          'Error al actualizar la emoción';
      setError(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleEmojiSelect = (emoji) => {
    setFormData(prev => ({
      ...prev,
      icon: emoji
    }));
  };

  const closeEditModal = () => {
    setEditingEmotion(null);
    setFormData({ name: '', icon: '' });
  };

  const closeCreateModal = () => {
    setShowCreateForm(false);
    setFormData({ name: '', icon: '' });
  };

  // Función para abrir el selector de emojis del sistema
  const openSystemEmojiPicker = () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.addEventListener('input', (e) => {
      if (e.target.value) {
        setFormData(prev => ({
          ...prev,
          icon: e.target.value
        }));
      }
    });
    // Esto abrirá el selector de emojis en dispositivos móviles
    // En desktop, el usuario puede usar su teclado
    input.focus();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestión de Emociones
            </h1>
            <p className="text-gray-600 mt-2">
              Administra las {emotions.length} emociones disponibles para las obras
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
          >
            <span>➕</span>
            <span>Nueva Emoción</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Crear Nueva Emoción</h3>
                <button
                  onClick={closeCreateModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleCreateEmotion} className="space-y-4">
                <div>
                  <label htmlFor="create-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Emoción *
                  </label>
                  <input
                    type="text"
                    id="create-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Felicidad, Tristeza, Inspiración..."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={formLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Emoji *
                  </label>
                  
                  {/* Emoji seleccionado */}
                  {formData.icon && (
                    <div className="mb-3 p-3 bg-gray-100 rounded-lg text-center">
                      <span className="text-4xl">{formData.icon}</span>
                      <p className="text-sm text-gray-600 mt-1">Emoji seleccionado</p>
                    </div>
                  )}

                  {/* Grid de emojis sugeridos */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Emojis sugeridos:</p>
                    <div className="grid grid-cols-8 gap-2">
                      {suggestedEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleEmojiSelect(emoji)}
                          className={`p-2 text-xl rounded-lg border-2 transition-all ${
                            formData.icon === emoji
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input personalizado para emoji */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={openSystemEmojiPicker}
                      className="w-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition-colors"
                    >
                      🎮 Usar emojis de tu teclado
                    </button>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={handleInputChange}
                      name="icon"
                      placeholder="O escribe/pega cualquier emoji aquí..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center text-2xl"
                      maxLength={10}
                      disabled={formLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Puedes usar cualquier emoji de tu teclado (Windows: ⊞ Win + . | Mac: ⌃ Ctrl + ⌘ Cmd + Space)
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={closeCreateModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    disabled={formLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                  >
                    {formLoading ? 'Creando...' : 'Crear Emoción'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {editingEmotion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Editar Emoción</h3>
                <button
                  onClick={closeEditModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleUpdateEmotion} className="space-y-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Emoción *
                  </label>
                  <input
                    type="text"
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    disabled={formLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seleccionar Emoji *
                  </label>
                  
                  {/* Emoji seleccionado */}
                  {formData.icon && (
                    <div className="mb-3 p-3 bg-gray-100 rounded-lg text-center">
                      <span className="text-4xl">{formData.icon}</span>
                      <p className="text-sm text-gray-600 mt-1">Emoji seleccionado</p>
                    </div>
                  )}

                  {/* Grid de emojis sugeridos */}
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Emojis sugeridos:</p>
                    <div className="grid grid-cols-8 gap-2">
                      {suggestedEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, icon: emoji }))}
                          className={`p-2 text-xl rounded-lg border-2 transition-all ${
                            formData.icon === emoji
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input personalizado para emoji */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={openSystemEmojiPicker}
                      className="w-full bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-100 transition-colors"
                    >
                      🎮 Usar emojis de tu teclado
                    </button>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      placeholder="O escribe/pega cualquier emoji aquí..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-center text-2xl"
                      maxLength={10}
                      disabled={formLoading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Puedes usar cualquier emoji de tu teclado
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                    disabled={formLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                  >
                    {formLoading ? 'Actualizando...' : 'Actualizar Emoción'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Grid de emociones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {emotions.map((emotion) => (
          <div key={emotion.id_emocion} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {emotion.name}
                </h3>
                <span className="text-3xl">{emotion.icon}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                ID: {emotion.id_emocion}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditEmotion(emotion)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteEmotion(emotion.id_emocion, emotion.name)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay emociones */}
      {emotions.length === 0 && !showCreateForm && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No hay emociones
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza creando la primera emoción
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Crear Primera Emoción
          </button>
        </div>
      )}
    </div>
  );
};

export default EmotionsManagement;