import React, { useState, useEffect } from 'react';
import { reactionService } from '../../services/reactionService';
import { useAuth } from '../../context/AuthContext';
import './ReactionButton.css';

const ReactionButton = ({ obra, onReactionUpdate, initialReactions }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  // NUEVO: Usar estado local basado en initialReactions
  const [reactions, setReactions] = useState(() => {
    if (initialReactions && initialReactions.reactions) {
      return initialReactions.reactions;
    }
    return [];
  });

  const [totalReactions, setTotalReactions] = useState(() => {
    if (initialReactions && initialReactions.total_reactions !== undefined) {
      return initialReactions.total_reactions;
    }
    return 0;
  });

  // NUEVO: Efecto para sincronizar con initialReactions
  useEffect(() => {
    if (initialReactions) {
      setReactions(initialReactions.reactions || []);
      setTotalReactions(initialReactions.total_reactions || 0);
    }
  }, [initialReactions]);

  const availableEmojis = ['❤️', '🔥', '⭐', '😮', '🎨', '👏', '💫', '✨'];

  // Cargar reacciones si no vienen por prop
  const loadReactions = async () => {
    if (!obra?.id_obra) return;
    
    try {
      const datos = await reactionService.getReactionsByWork(obra.id_obra);
      
      setReactions(datos.reactions || []);
      setTotalReactions(datos.total_reactions || 0);
      
      // Notificar al padre
      if (onReactionUpdate) {
        onReactionUpdate(datos);
      }
      
      return datos;
    } catch (error) {
      console.error('Error cargando reacciones:', error);
      return null;
    }
  };

  // Cargar al montar si no hay initialReactions
  useEffect(() => {
    if (!initialReactions && obra?.id_obra) {
      loadReactions();
    }
  }, [obra?.id_obra]);

  const handleReaction = async (emoji) => {
    if (!user || !obra?.id_obra) {
      alert('Debes iniciar sesión para reaccionar');
      return;
    }

    setIsLoading(true);

    try {
      // Verificar si ya reaccionó
      const currentReactions = await reactionService.getReactionsByWork(obra.id_obra);
      let userReaction = null;
      let userReactionId = null;

      if (currentReactions.reactions) {
        for (const reaction of currentReactions.reactions) {
          if (reaction.user_reacted === true) {
            userReaction = reaction.emoji;
            userReactionId = reaction.user_reaction_id;
            break;
          }
        }
      }

      // Si ya reaccionó con el mismo emoji, eliminar
      if (userReaction === emoji && userReactionId) {
        await reactionService.delete(userReactionId);
      } 
      // Si ya reaccionó con otro emoji, actualizar
      else if (userReaction && userReactionId) {
        await reactionService.delete(userReactionId);
        await reactionService.create({
          emoji: emoji,
          id_usuario: user.id_usuario,
          id_obra: obra.id_obra
        });
      } 
      // Si no ha reaccionado, crear nueva
      else {
        await reactionService.create({
          emoji: emoji,
          id_usuario: user.id_usuario,
          id_obra: obra.id_obra
        });
      }

      // Recargar reacciones y notificar al padre
      const updatedData = await loadReactions();
      
      // Notificar al padre (por si acaso loadReactions no lo hizo)
      if (onReactionUpdate && updatedData) {
        onReactionUpdate(updatedData);
      }

      // Cerrar picker
      setShowEmojiPicker(false);

    } catch (error) {
      console.error('Error en reacción:', error);
      alert(error.response?.data?.message || 'Error al procesar la reacción');
    } finally {
      setIsLoading(false);
    }
  };

  // Encontrar si el usuario ya reaccionó
  const getUserReaction = () => {
    if (!reactions) return null;
    
    for (const reaction of reactions) {
      if (reaction.user_reacted === true) {
        return {
          emoji: reaction.emoji,
          id: reaction.user_reaction_id
        };
      }
    }
    return null;
  };

  const userReaction = getUserReaction();

  return (
    <div className="reaction-button-container">
      <button
        className={`reaction-button-main ${userReaction ? 'reaction-button-active' : ''}`}
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        disabled={isLoading}
        title={userReaction ? `Reaccionaste con ${userReaction.emoji}` : 'Reaccionar'}
      >
        <span className="reaction-button-icon">
          {userReaction ? userReaction.emoji : '❤️'}
        </span>
        {totalReactions > 0 && (
          <span className="reaction-button-count">{totalReactions}</span>
        )}
      </button>

      {showEmojiPicker && (
        <div className="reaction-emoji-picker">
          <div className="reaction-emoji-grid">
            {availableEmojis.map((emoji) => (
              <button
                key={emoji}
                className={`reaction-emoji-btn ${userReaction?.emoji === emoji ? 'reaction-emoji-selected' : ''}`}
                onClick={() => handleReaction(emoji)}
                disabled={isLoading}
                title={userReaction?.emoji === emoji ? `Quitar ${emoji}` : `Reaccionar con ${emoji}`}
              >
                {emoji}
                {userReaction?.emoji === emoji && (
                  <span className="reaction-emoji-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReactionButton;