import React, { useState, useEffect, useRef } from 'react';
import { reactionService } from '../../services/reactionService';
import { useAuth } from '../../context/AuthContext';
import CommentsSection from '../comments/CommentsSection';
import './ObraDetailModal.css';

const ObraDetailModal = ({ obra, isOpen, onClose, initialReactions, onReactionUpdate }) => {
  const { user } = useAuth();

  // NUEVO: Usar initialReactions como estado inicial
  const [reactions, setReactions] = useState(() => {
    if (initialReactions && initialReactions.reactions) {
      return initialReactions.reactions;
    }
    return [];
  });

  const [loadingReactions, setLoadingReactions] = useState(false);
  
  const [totalReactions, setTotalReactions] = useState(() => {
    if (initialReactions && initialReactions.total_reactions !== undefined) {
      return initialReactions.total_reactions;
    }
    return 0;
  });

  const [userAlreadyReacted, setUserAlreadyReacted] = useState(() => {
    if (initialReactions && initialReactions.reactions) {
      for (const reaction of initialReactions.reactions) {
        if (reaction.user_reacted === true) {
          return true;
        }
      }
    }
    return false;
  });

  const [userReactionId, setUserReactionId] = useState(null);
  const [userReactionEmoji, setUserReactionEmoji] = useState(null);

  // Referencia para tracking del ID actual
  const currentObraIdRef = useRef(null);

  // Emojis disponibles
  const availableEmojis = ['❤️', '🔥', '⭐', '😮', '🎨', '👏', '💫', '✨'];

  // ========== EFFECT PARA SINCRONIZAR CON PROPS ==========
  useEffect(() => {
    if (initialReactions) {
      console.log('🔄 Sincronizando reacciones desde props:', initialReactions);
      setReactions(initialReactions.reactions || []);
      setTotalReactions(initialReactions.total_reactions || 0);
      
      // Buscar si usuario reaccionó
      let userReacted = false;
      let userEmoji = null;
      let userReactionId = null;
      
      if (initialReactions.reactions) {
        for (const reaction of initialReactions.reactions) {
          if (reaction.user_reacted === true) {
            userReacted = true;
            userEmoji = reaction.emoji;
            userReactionId = reaction.user_reaction_id;
            break;
          }
        }
      }
      
      setUserAlreadyReacted(userReacted);
      setUserReactionEmoji(userEmoji);
      setUserReactionId(userReactionId);
    }
  }, [initialReactions]);

  // ========== EFFECT PARA CAMBIOS DE OBRA ==========
  useEffect(() => {
    if (isOpen && obra && obra.id_obra) {
      const obraId = obra.id_obra;
      
      console.log(`🎯 Modal abierto para obra ID: ${obraId}`);
      
      // Solo cargar si no tenemos datos iniciales o cambió de obra
      if (!initialReactions || currentObraIdRef.current !== obraId) {
        console.log('🔄 Cargando reacciones desde API...');
        loadReactions();
        currentObraIdRef.current = obraId;
      } else {
        console.log('✅ Usando reacciones de props');
      }
    }
  }, [isOpen, obra?.id_obra, initialReactions]);

  // ========== CARGAR REACCIONES DESDE API ==========
  const loadReactions = async () => {
    if (!obra || !obra.id_obra) {
      console.error('❌ No hay obra o ID de obra para cargar reacciones');
      return;
    }

    const obraId = obra.id_obra;
    console.log(`🔄 Cargando reacciones para obra: ${obraId}`);

    setLoadingReactions(true);

    try {
      const datos = await reactionService.getReactionsByWork(obraId);
      console.log(`📦 Reacciones recibidas para obra ${obraId}:`, datos);

      if (datos) {
        // Actualizar estado local
        const reaccionesData = datos.reactions || [];
        setReactions(reaccionesData);
        setTotalReactions(datos.total_reactions || reaccionesData.length || 0);
        
        // Buscar reacción del usuario
        let usuarioYaReacciono = false;
        let emojiReaccionUsuario = null;
        let idReaccionUsuario = null;

        reaccionesData.forEach((reaccion) => {
          if (reaccion.user_reacted === true) {
            usuarioYaReacciono = true;
            emojiReaccionUsuario = reaccion.emoji;
            idReaccionUsuario = reaccion.user_reaction_id;
            console.log(`✅ Usuario reaccionó con ${reaccion.emoji}, ID: ${reaccion.user_reaction_id}`);
          }
        });

        console.log('📋 Estado detectado:', {
          usuarioYaReacciono,
          emojiReaccionUsuario,
          idReaccionUsuario
        });

        setUserAlreadyReacted(usuarioYaReacciono);
        setUserReactionEmoji(emojiReaccionUsuario);
        setUserReactionId(idReaccionUsuario);

        // Notificar al padre (Gallery) para actualizar su estado
        if (onReactionUpdate) {
          onReactionUpdate(datos);
        }
      }

    } catch (error) {
      console.error(`❌ ERROR cargando reacciones para obra ${obraId}:`, error);
    } finally {
      setLoadingReactions(false);
    }
  };

  // ========== MANEJAR REACCIÓN (ACTUALIZADO) ==========
  const handleReaction = async (emoji) => {
    if (!user || !obra || !obra.id_obra) {
      alert('Debes iniciar sesión para reaccionar');
      return;
    }

    const obraId = obra.id_obra;
    console.log(`=== REACCIÓN para obra ${obraId} ===`);
    console.log('Emoji:', emoji);

    try {
      // Si ya reaccionó y es el mismo emoji, ELIMINAR
      if (userAlreadyReacted && userReactionEmoji === emoji) {
        console.log('🗑️ Eliminando reacción...');

        if (userReactionId) {
          await reactionService.delete(userReactionId);
        }

        // Actualizar estado local inmediatamente
        setUserAlreadyReacted(false);
        setUserReactionId(null);
        setUserReactionEmoji(null);
      }
      // Si ya reaccionó con otro emoji, CAMBIAR
      else if (userAlreadyReacted && userReactionEmoji !== emoji) {
        const confirmar = window.confirm(
          `Ya reaccionaste con ${userReactionEmoji}. ¿Cambiar a ${emoji}?`
        );

        if (!confirmar) return;

        console.log('🔄 Cambiando reacción...');

        if (userReactionId) {
          await reactionService.delete(userReactionId);
        }

        await reactionService.create({
          emoji: emoji,
          id_usuario: user.id_usuario,
          id_obra: obraId
        });

        // Actualizar estado
        setUserReactionEmoji(emoji);
      }
      // CREAR nueva reacción
      else {
        console.log('➕ Creando nueva reacción...');

        await reactionService.create({
          emoji: emoji,
          id_usuario: user.id_usuario,
          id_obra: obraId
        });

        // Actualizar estado
        setUserAlreadyReacted(true);
        setUserReactionEmoji(emoji);
      }

      // Recargar reacciones (esto también notificará al padre)
      await loadReactions();

    } catch (error) {
      console.error('❌ Error en reacción:', error);
      
      if (error.response?.status === 409) {
        alert('❌ Ya has reaccionado a esta obra');
        // Forzar recarga para sincronizar
        setTimeout(() => {
          loadReactions();
        }, 200);
      } else {
        alert('Error: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  // ========== FUNCIONES DE UTILIDAD ==========
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';

    try {
      const fecha = new Date(dateString);
      return fecha.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const getEmojiDescription = (emoji) => {
    const descriptions = {
      '❤️': 'Me encanta',
      '🔥': 'Increíble',
      '⭐': 'Destacado',
      '😮': 'Sorprendente',
      '🎨': 'Artístico',
      '👏': 'Aplausos',
      '💫': 'Mágico',
      '✨': 'Brillante'
    };
    return descriptions[emoji] || emoji;
  };

  const getEmojiButtonClass = (emoji) => {
    let clase = 'obra-detail-modal-emoji-btn';

    if (userAlreadyReacted) {
      if (userReactionEmoji === emoji) {
        clase += ' obra-detail-modal-emoji-selected';
      } else {
        clase += ' obra-detail-modal-emoji-disabled';
      }
    }

    return clase;
  };

  const getEmojiButtonTitle = (emoji) => {
    if (userAlreadyReacted) {
      if (userReactionEmoji === emoji) {
        return `Quitar ${getEmojiDescription(emoji)}`;
      } else {
        return 'Ya reaccionaste a esta obra';
      }
    } else {
      return getEmojiDescription(emoji);
    }
  };

  const isEmojiButtonDisabled = (emoji) => {
    return userAlreadyReacted && userReactionEmoji !== emoji;
  };

  // ========== RENDER REACCIONES COMUNIDAD ==========
  const renderCommunityReactions = () => {
    if (!reactions || reactions.length === 0) {
      return (
        <div className="obra-detail-modal-no-reactions">
          <div className="obra-detail-modal-no-reactions-content">
            <span className="obra-detail-modal-no-reactions-icon">💭</span>
            <p className="obra-detail-modal-no-reactions-text">
              Nadie ha reaccionado aún
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="obra-detail-modal-reactions-list">
        <h5 className="obra-detail-modal-reactions-list-title">
          Reacciones de la comunidad:
        </h5>
        <div className="obra-detail-modal-reactions-grid">
          {reactions.map((reaction, index) => (
            <div key={`reaction-${obra.id_obra}-${reaction.emoji}-${index}`} className="obra-detail-modal-reaction-item">
              <div className="obra-detail-modal-reaction-header">
                <button
                  className={`obra-detail-modal-reaction-btn ${userAlreadyReacted ? 'obra-detail-modal-reaction-disabled' : ''} ${userAlreadyReacted && userReactionEmoji === reaction.emoji ? 'obra-detail-modal-reaction-selected' : ''
                    }`}
                  onClick={() => handleReaction(reaction.emoji)}
                  disabled={userAlreadyReacted && userReactionEmoji !== reaction.emoji}
                  title={getEmojiButtonTitle(reaction.emoji)}
                >
                  <span className="obra-detail-modal-reaction-emoji">{reaction.emoji}</span>
                  <span className="obra-detail-modal-reaction-count">{reaction.count || 0}</span>

                  {userAlreadyReacted && userReactionEmoji === reaction.emoji && (
                    <span className="obra-detail-modal-reaction-check">✓</span>
                  )}
                </button>
              </div>

              {reaction.users && reaction.users.length > 0 && (
                <div className="obra-detail-modal-reaction-users">
                  <div className="obra-detail-modal-users-avatars">
                    {reaction.users.slice(0, 3).map((usuario, userIndex) => (
                      <div
                        key={`user-${obra.id_obra}-${reaction.emoji}-${userIndex}`}
                        className="obra-detail-modal-user-avatar-small"
                        title={usuario.nickname || 'Usuario'}
                      >
                        <span className="obra-detail-modal-user-initial">
                          {(usuario.nickname || 'U').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    ))}
                    {reaction.count > 3 && (
                      <div className="obra-detail-modal-more-users" title={`${reaction.count - 3} más`}>
                        +{reaction.count - 3}
                      </div>
                    )}
                  </div>
                  <p className="obra-detail-modal-users-hint">
                    {reaction.users[0]?.nickname || 'Usuario'}
                    {reaction.count > 1 ? ` y ${reaction.count - 1} más` : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ========== RENDER PRINCIPAL ==========
  if (!isOpen || !obra) return null;

  return (
    <div className="obra-detail-modal-overlay" onClick={onClose}>
      <div
        className="obra-detail-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="obra-detail-modal-header">
          <div className="obra-detail-modal-header-content">
            <h2 className="obra-detail-modal-title">{obra.title}</h2>
            <p className="obra-detail-modal-subtitle">
              Una obra creada con ❤️ por nuestra comunidad
            </p>
          </div>
          <button
            onClick={onClose}
            className="obra-detail-modal-close-btn"
            title="Cerrar"
          >
            <span className="obra-detail-modal-close-icon">×</span>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="obra-detail-modal-body">
          <div className="obra-detail-modal-layout">
            {/* Imagen */}
            <div className="obra-detail-modal-image-section">
              {obra.image ? (
                <div className="obra-detail-modal-image-container">
                  <img
                    src={`http://localhost:8000/storage/${obra.image}`}
                    alt={obra.title}
                    className="obra-detail-modal-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="obra-detail-modal-image-fallback">
                    <span className="obra-detail-modal-fallback-icon">🎨</span>
                    <p>Imagen no disponible</p>
                  </div>
                </div>
              ) : (
                <div className="obra-detail-modal-image-placeholder">
                  <span className="obra-detail-modal-placeholder-icon">🖼️</span>
                  <p>Sin imagen</p>
                </div>
              )}
            </div>

            {/* Información */}
            <div className="obra-detail-modal-info-section">
              {/* Artista */}
              <div className="obra-detail-modal-artist-info">
                <div className="obra-detail-modal-artist-avatar">
                  {obra.user?.nickname?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="obra-detail-modal-artist-details">
                  <h3 className="obra-detail-modal-artist-name">
                    {obra.user?.nickname || 'Artista'}
                  </h3>
                  <p className="obra-detail-modal-artist-role">Creador de la obra</p>
                </div>
              </div>

              {/* Reacciones */}
              <div className="obra-detail-modal-reactions-section">
                <div className="obra-detail-modal-reactions-header">
                  <h4 className="obra-detail-modal-section-title">
                    <span className="obra-detail-modal-title-icon">💖</span>
                    Reacciones {totalReactions > 0 && `(${totalReactions})`}
                  </h4>
                  <span className="obra-detail-modal-reactions-subtitle">
                    {userAlreadyReacted
                      ? userReactionEmoji
                        ? `Ya reaccionaste con ${userReactionEmoji}`
                        : 'Ya reaccionaste'
                      : 'Expresa lo que sientes'}
                  </span>
                </div>

                {/* Selector emojis */}
                <div className="obra-detail-modal-reactions-selector">
                  <p className="obra-detail-modal-reactions-hint">
                    {userAlreadyReacted
                      ? userReactionEmoji
                        ? `Haz clic en ${userReactionEmoji} para quitarlo`
                        : 'Ya reaccionaste'
                      : 'Elige un emoji:'}
                  </p>
                  <div className="obra-detail-modal-emojis-container">
                    {availableEmojis.map((emoji, index) => (
                      <button
                        key={`emoji-${obra.id_obra}-${emoji}-${index}`}
                        className={getEmojiButtonClass(emoji)}
                        onClick={() => handleReaction(emoji)}
                        title={getEmojiButtonTitle(emoji)}
                        disabled={isEmojiButtonDisabled(emoji)}
                      >
                        <span className="obra-detail-modal-emoji">{emoji}</span>
                        {userAlreadyReacted && userReactionEmoji === emoji && (
                          <span className="obra-detail-modal-emoji-check">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                  {userAlreadyReacted && userReactionEmoji && (
                    <p className="obra-detail-modal-reactions-note">
                      Puedes cambiar de emoji confirmando el cambio
                    </p>
                  )}
                </div>

                {/* Lista reacciones */}
                {loadingReactions ? (
                  <div className="obra-detail-modal-loading-reactions">
                    <div className="obra-detail-modal-loading-spinner"></div>
                    <p>Cargando reacciones...</p>
                  </div>
                ) : (
                  renderCommunityReactions()
                )}
              </div>

              {/* Descripción */}
              <div className="obra-detail-modal-description-section">
                <h4 className="obra-detail-modal-section-title">
                  <span className="obra-detail-modal-title-icon">📝</span>
                  Descripción
                </h4>
                <p className="obra-detail-modal-description-text">
                  {obra.description || 'Sin descripción'}
                </p>
              </div>

              {/* Metadatos */}
              <div className="obra-detail-modal-metadata-grid">
                <div className="obra-detail-modal-metadata-item">
                  <div className="obra-detail-modal-metadata-icon">📅</div>
                  <div className="obra-detail-modal-metadata-content">
                    <span className="obra-detail-modal-metadata-label">Publicado</span>
                    <span className="obra-detail-modal-metadata-value">
                      {formatDate(obra.published_at)}
                    </span>
                  </div>
                </div>

                <div className="obra-detail-modal-metadata-item">
                  <div className="obra-detail-modal-metadata-icon">🏷️</div>
                  <div className="obra-detail-modal-metadata-content">
                    <span className="obra-detail-modal-metadata-label">Categoría</span>
                    <span className="obra-detail-modal-metadata-value">
                      {obra.category?.name || 'Sin categoría'}
                    </span>
                  </div>
                </div>

                {obra.emotion && (
                  <div className="obra-detail-modal-metadata-item">
                    <div className="obra-detail-modal-metadata-icon">😊</div>
                    <div className="obra-detail-modal-metadata-content">
                      <span className="obra-detail-modal-metadata-label">Emoción</span>
                      <span className="obra-detail-modal-metadata-value">
                        {obra.emotion.icon} {obra.emotion.name}
                      </span>
                    </div>
                  </div>
                )}

                <div className="obra-detail-modal-metadata-item">
                  <div className="obra-detail-modal-metadata-icon">🆔</div>
                  <div className="obra-detail-modal-metadata-content">
                    <span className="obra-detail-modal-metadata-label">ID Obra</span>
                    <span className="obra-detail-modal-metadata-value">#{obra.id_obra}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comentarios */}
          <div className="obra-detail-modal-comments-section">
            <CommentsSection obraId={obra.id_obra} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObraDetailModal;