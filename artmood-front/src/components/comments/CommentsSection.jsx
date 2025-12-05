import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import commentService from '../../services/commentService';
import './CommentsSection.css';

const CommentsSection = ({ obraId }) => {
    const { user } = useAuth();
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [textoEditado, setTextoEditado] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (obraId) {
            loadComentarios();
        }
    }, [obraId]);

    const loadComentarios = async () => {
        try {
            setLoading(true);
            const response = await commentService.getByObra(obraId);
            const comentariosData = response.data || response;

            // Asegurar que tenemos un array
            if (comentariosData && Array.isArray(comentariosData)) {
                setComentarios(comentariosData);
            } else if (comentariosData && comentariosData.data) {
                // Si viene con estructura { data: [...] }
                setComentarios(Array.isArray(comentariosData.data) ? comentariosData.data : []);
            } else {
                setComentarios([]);
            }
        } catch (error) {
            console.error('❌ Error cargando comentarios:', error);
            setError('Error al cargar los comentarios');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComentario = async (e) => {
        e.preventDefault();

        if (!nuevoComentario.trim()) {
            setError('El comentario no puede estar vacío');
            return;
        }

        if (!user) {
            setError('Debes iniciar sesión para comentar');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const comentarioData = {
                content: nuevoComentario,
                id_usuario: user.id_usuario || user.id,
                id_obra: parseInt(obraId),
                status: 'visible'  // Añadir status
            };

            await commentService.create(comentarioData);
            setNuevoComentario('');
            await loadComentarios();

        } catch (error) {
            console.error('❌ Error creando comentario:', error);
            if (error.response?.status === 422) {
                const validationErrors = error.response.data?.errors;
                if (validationErrors) {
                    const errorMessages = Object.values(validationErrors).flat().join(', ');
                    setError(`Errores: ${errorMessages}`);
                } else {
                    setError('Error de validación en el servidor');
                }
            } else {
                setError('Error al publicar el comentario');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleIniciarEdicion = (comentario) => {
        setEditandoId(comentario.id_comentario);
        setTextoEditado(comentario.content);
    };

    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setTextoEditado('');
    };

    const handleGuardarEdicion = async (comentarioId) => {
        if (!textoEditado.trim()) {
            setError('El comentario no puede estar vacío');
            return;
        }

        setLoading(true);
        try {
            await commentService.update(comentarioId, { content: textoEditado });
            await loadComentarios();
            setEditandoId(null);
            setTextoEditado('');
            alert('Comentario actualizado correctamente');
        } catch (error) {
            console.error('❌ Error editando comentario:', error);
            setError('Error al editar el comentario');
        } finally {
            setLoading(false);
        }
    };

    const handleEliminarComentario = async (comentarioId, contenido) => {
        const contenidoSeguro = contenido || 'este comentario';
        const preview = contenidoSeguro.length > 50
            ? `${contenidoSeguro.substring(0, 50)}...`
            : contenidoSeguro;

        if (!window.confirm(`¿Estás seguro de eliminar el comentario "${preview}"?`)) {
            return;
        }

        try {
            await commentService.delete(comentarioId);
            await loadComentarios();
            alert('Comentario eliminado correctamente');
        } catch (error) {
            console.error('Error eliminando comentario:', error);
            alert('Error al eliminar el comentario');
        }
    };

    const formatFecha = (fecha) => {
        if (!fecha) return 'Recién publicado';

        const ahora = new Date();
        const fechaComentario = new Date(fecha);

        // Si la fecha es inválida
        if (isNaN(fechaComentario.getTime())) {
            return 'Recién publicado';
        }

        const diffMs = ahora - fechaComentario;
        const diffSegs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffSegs < 30) return 'Ahora mismo';
        if (diffSegs < 60) return `Hace ${diffSegs} segundos`;
        if (diffMins < 1) return 'Hace menos de un minuto';
        if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
        if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
        if (diffDays < 7) return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;

        // Si es más de una semana, mostrar fecha completa
        return fechaComentario.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="gallery-comments-section">
            {/* Header */}
            <div className="gallery-comments-header">
                <div className="gallery-comments-header-content">
                    <h2 className="gallery-comments-section-title">Comentarios de la Comunidad</h2>
                    <p className="gallery-comments-section-subtitle">Comparte tus pensamientos sobre esta obra</p>
                </div>
                <div className="gallery-comments-count-badge">
                    <span className="gallery-comments-count-number">{comentarios.length}</span>
                    <span className="gallery-comments-count-text">comentarios</span>
                </div>
            </div>

            {/* Lista de comentarios */}
            <div className={`gallery-comments-list ${isExpanded ? 'gallery-comments-expanded' : ''}`}>
                {comentarios.length === 0 ? (
                    <div className="gallery-comments-empty-state">
                        <div className="gallery-comments-empty-icon">💬</div>
                        <h3>No hay comentarios aún</h3>
                        <p>Sé el primero en compartir tu opinión</p>
                    </div>
                ) : (
                    <div className="gallery-comments-grid">
                        {comentarios.map((comentario) => (
                            <div key={comentario.id_comentario} className="gallery-comment-card">
                                <div className="gallery-comment-header">
                                    <div className="gallery-comment-user-info">
                                        <div className="gallery-comment-user-avatar">
                                            {comentario.user?.name?.charAt(0) ||
                                                comentario.usuario?.name?.charAt(0) ||
                                                'U'}
                                        </div>
                                        <div className="gallery-comment-user-details">
                                            <span className="gallery-comment-user-name">
                                                {comentario.user?.name ||
                                                    comentario.usuario?.name ||
                                                    'Usuario'}
                                            </span>
                                            <span className="gallery-comment-user-handle">
                                                @{comentario.user?.nickname ||
                                                    comentario.usuario?.nickname ||
                                                    'anonimo'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="gallery-comment-meta">
                                        <span className="gallery-comment-date">
                                            {formatFecha(comentario.commented_at)}
                                        </span>

                                        {user && (user.id_usuario || user.id) === comentario.id_usuario && (
                                            <div className="gallery-comment-actions">
                                                {editandoId === comentario.id_comentario ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleGuardarEdicion(comentario.id_comentario)}
                                                            className="gallery-comment-save-btn"
                                                            disabled={loading}
                                                        >
                                                            Guardar
                                                        </button>
                                                        <button
                                                            onClick={handleCancelarEdicion}
                                                            className="gallery-comment-cancel-btn"
                                                            disabled={loading}
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() => handleIniciarEdicion(comentario)}
                                                            className="gallery-comment-edit-btn"
                                                            title="Editar comentario"
                                                        >
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                                <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" />
                                                                <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminarComentario(comentario.id_comentario, comentario.content)}
                                                            className="gallery-comment-delete-btn"
                                                            title="Eliminar comentario"
                                                            aria-label="Eliminar comentario"
                                                        >
                                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M3 6H5H21" />
                                                                <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" />
                                                                <path d="M10 11V17" />
                                                                <path d="M14 11V17" />
                                                            </svg>
                                                    
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="gallery-comment-content">
                                    {editandoId === comentario.id_comentario ? (
                                        <textarea
                                            value={textoEditado}
                                            onChange={(e) => setTextoEditado(e.target.value)}
                                            className="gallery-comment-edit-textarea"
                                            rows="3"
                                            maxLength="500"
                                        />
                                    ) : (
                                        comentario.content
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Botón para expandir/contraer comentarios si hay muchos */}
            {comentarios.length > 3 && (
                <div className="gallery-comments-expand-section">
                    <button
                        className="gallery-comments-expand-btn"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Ver menos' : `Ver todos los ${comentarios.length} comentarios`}
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            className={isExpanded ? 'gallery-comments-expanded-icon' : ''}
                        >
                            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Formulario de comentario */}
            <div className="gallery-comment-form">
                {user ? (
                    <form onSubmit={handleSubmitComentario} className="gallery-comment-form-content">
                        {error && (
                            <div className="gallery-comment-error-message">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="gallery-comment-form-header">
                            <div className="gallery-comment-current-user">
                                <div className="gallery-comment-user-avatar gallery-comment-user-avatar-small">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <span className="gallery-comment-user-greeting">Comentar como {user.name}</span>
                            </div>
                        </div>

                        <div className="gallery-comment-textarea-container">
                            <textarea
                                value={nuevoComentario}
                                onChange={(e) => setNuevoComentario(e.target.value)}
                                placeholder="Escribe tu comentario..."
                                rows="4"
                                className="gallery-comment-textarea"
                                disabled={loading}
                                maxLength="500"
                            />
                            <div className="gallery-comment-textarea-footer">
                                <span className="gallery-comment-char-counter">
                                    {nuevoComentario.length}/500 caracteres
                                </span>
                                <button
                                    type="submit"
                                    disabled={loading || !nuevoComentario.trim()}
                                    className="gallery-comment-submit-btn"
                                >
                                    {loading ? (
                                        <>
                                            <div className="gallery-comment-loading-spinner"></div>
                                            Publicando...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" />
                                            </svg>
                                            Comentar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="gallery-comment-login-prompt">
                        <div className="gallery-comment-prompt-content">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z" stroke="currentColor" strokeWidth="2" />
                                <path d="M12 2V4M12 20V22M4 12H2M6.343 6.343L4.929 4.929M17.657 6.343L19.071 4.929M6.343 17.657L4.929 19.071M17.657 17.657L19.071 19.071M22 12H20" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <div className="gallery-comment-prompt-text">
                                <h4>Únete a la conversación</h4>
                                <p>Inicia sesión para compartir tus pensamientos sobre esta obra</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentsSection;