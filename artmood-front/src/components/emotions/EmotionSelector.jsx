// components/emotions/EmotionSelector.jsx
import React, { useState, useEffect } from 'react';
import { emotionService } from '../../services/emotionService';

const EmotionSelector = ({ selectedEmotion, onEmotionChange, obraId }) => {
  const [emociones, setEmociones] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEmociones();
  }, []);

  const cargarEmociones = async () => {
    try {
      const response = await emotionService.getAll();
      setEmociones(response.data);
    } catch (error) {
      console.error('Error cargando emociones:', error);
    }
  };

  const handleEmotionSelect = async (idEmocion) => {
    if (loading) return;
    
    setLoading(true);
    try {
      await onEmotionChange(idEmocion);
    } catch (error) {
      console.error('Error seleccionando emoción:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="emotion-selector">
      <h4>¿Qué emoción representa tu obra?</h4>
      <div className="emotions-grid">
        {emociones.map(emocion => (
          <button
            key={emocion.id_emocion}
            onClick={() => handleEmotionSelect(emocion.id_emocion)}
            disabled={loading}
            className={`emotion-btn ${
              selectedEmotion === emocion.id_emocion ? 'selected' : ''
            }`}
            title={emocion.descripcion}
          >
            <span className="emotion-icon">{emocion.icono}</span>
            <span className="emotion-name">{emocion.nombre_emocion}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmotionSelector;