import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { commentService } from '../../services/commentService';

const CommentsSection = ({ obraId }) => {
    const { user } = useAuth();
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (obraId) {
            loadComentarios();
        }
    }, [obraId]);

    const loadComentarios = async () => {
        try {
            setLoading(true);
            console.log(`🔄 Cargando comentarios para obra ${obraId}`);
            const response = await commentService.getByObra(obraId);

            // Manejar diferentes estructuras de respuesta
            const comentariosData = response.data || response;
            console.log('📝 Comentarios cargados:', comentariosData);

            setComentarios(Array.isArray(comentariosData) ? comentariosData : []);

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
                id_obra: parseInt(obraId) // Asegurar que es número
            };

            console.log('📤 Enviando datos del comentario:', comentarioData);

            await commentService.create(comentarioData);

            setNuevoComentario('');
            await loadComentarios();

        } catch (error) {
            console.error('❌ Error creando comentario:', error);

            // Mostrar errores detallados
            if (error.response?.status === 422) {
                const validationErrors = error.response.data?.errors;
                console.log('🔍 Errores de validación:', validationErrors);

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

    return (
        <div className="bg-white rounded-lg border border-gray-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Comentarios ({comentarios.length})
                </h3>
            </div>

            {/* Lista de comentarios */}
            <div className="max-h-96 overflow-y-auto">
                {comentarios.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No hay comentarios aún</p>
                        <p className="text-sm">Sé el primero en comentar</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {comentarios.map((comentario) => (
                            <div key={comentario.id_comentario} className="px-6 py-4 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        {/* Header del comentario */}
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                                                <span className="text-purple-600 text-xs font-medium">
                                                    {comentario.usuario?.name?.charAt(0) || 'U'}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {comentario.usuario?.name || 'Usuario'}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                @{comentario.usuario?.nickname || 'anonimo'}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {new Date(comentario.fecha_comentario).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {/* Contenido del comentario */}
                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                            {comentario.content || comentario.contenido} {/* Mostrar ambos por si acaso */}
                                        </p>
                                    </div>

                                    {/* Botón eliminar (solo para el propietario) */}
                                    {user && (user.id_usuario || user.id) === comentario.id_usuario && (
                                        <button
                                            onClick={() => handleEliminarComentario(comentario.id_comentario, comentario.contenido)}
                                            className="text-red-500 hover:text-red-700 text-sm ml-2 p-1 rounded hover:bg-red-50 transition-colors"
                                            title="Eliminar comentario"
                                        >
                                            🗑️
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Formulario para nuevo comentario */}
            {user && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <form onSubmit={handleSubmitComentario} className="space-y-3">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <textarea
                                value={nuevoComentario}
                                onChange={(e) => setNuevoComentario(e.target.value)}
                                placeholder="Escribe tu comentario..."
                                rows="3"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                                disabled={loading}
                                maxLength="500"
                            />
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-gray-500">
                                    {nuevoComentario.length}/500 caracteres
                                </span>
                                <button
                                    type="submit"
                                    disabled={loading || !nuevoComentario.trim()}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Publicando...' : 'Comentar'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {!user && (
                <div className="px-6 py-4 border-t border-gray-200 bg-yellow-50 text-center">
                    <p className="text-sm text-yellow-800">
                        💡 Inicia sesión para dejar un comentario
                    </p>
                </div>
            )}
        </div>
    );
};

export default CommentsSection;