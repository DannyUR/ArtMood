// components/reactions/ReactionButtons.jsx
import React, { useState, useEffect } from 'react';
import { reactionService } from '../../services/reactionService';
import { useAuth } from '../../context/AuthContext';

const ReactionButtons = ({ obraId, onReactionUpdate }) => {
  const [reacciones, setReacciones] = useState([]);
  const [miReaccion, setMiReaccion] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const emojis = ['❤️', '🔥', '⭐', '😮', '😢', '👍'];

  useEffect(() => {
    cargarReacciones();
  }, [obraId]);

  const cargarReacciones = async () => {
    try {
      const response = await reactionService.getByObra(obraId);
      setReacciones(response.data);
      
      // Encontrar mi reacción
      const miReacc = response.data.find(r => r.id_usuario === user.id);
      setMiReaccion(miReacc);
    } catch (error) {
      console.error('Error cargando reacciones:', error);
    }
  };

  const handleReaccionar = async (emoji) => {
    if (loading) return;
    
    setLoading(true);
    try {
      // Si ya tengo una reacción, la elimino
      if (miReaccion) {
        await reactionService.delete(miReaccion.id_reaccion);
        setMiReaccion(null);
        
        // Si es el mismo emoji, solo quitar reacción
        if (miReaccion.emoji === emoji) {
          await cargarReacciones();
          if (onReactionUpdate) onReactionUpdate();
          return;
        }
      }

      // Agregar nueva reacción
      const reactionData = {
        emoji: emoji,
        id_usuario: user.id,
        id_obra: obraId
      };
      
      await reactionService.create(reactionData);
      await cargarReacciones();
      
      if (onReactionUpdate) onReactionUpdate();
      
    } catch (error) {
      console.error('Error manejando reacción:', error);
    } finally {
      setLoading(false);
    }
  };

  // Contar reacciones por emoji
  const contarReacciones = (emoji) => {
    return reacciones.filter(r => r.emoji === emoji).length;
  };

  return (
    <div className="reaction-buttons">
      <h4>Reacciones</h4>
      <div className="reactions-grid">
        {emojis.map(emoji => (
          <button
            key={emoji}
            onClick={() => handleReaccionar(emoji)}
            disabled={loading}
            className={`reaction-btn ${miReaccion?.emoji === emoji ? 'active' : ''}`}
            title={`Reaccionar con ${emoji}`}
          >
            <span className="emoji">{emoji}</span>
            <span className="count">{contarReacciones(emoji)}</span>
          </button>
        ))}
      </div>
      
      {/* Botón para quitar reacción si existe */}
      {miReaccion && (
        <button
          onClick={() => handleReaccionar(miReaccion.emoji)}
          disabled={loading}
          className="btn-quitar-reaccion"
        >
          ❌ Quitar mi reacción
        </button>
      )}
    </div>
  );
};

export default ReactionButtons;