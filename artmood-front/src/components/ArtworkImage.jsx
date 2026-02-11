// components/ArtworkImage.jsx
import React, { useState, useEffect } from 'react';
import './ArtworkImage.css';

const ArtworkImage = ({ 
    obra, 
    className = '', 
    size = 'medium',
    showInfo = false,
    interactive = false,
    onImageClick,
    ...props 
}) => {
    const [status, setStatus] = useState('loading');
    const [retryCount, setRetryCount] = useState(0);
    const [hover, setHover] = useState(false);
    
    // Construir URL de imagen
    const getImageUrl = () => {
        if (!obra) return '';
        
        // Si viene image_url del backend
        if (obra.image_url && typeof obra.image_url === 'string') {
            return obra.image_url;
        }
        
        // Si viene solo el campo image
        if (obra.image && typeof obra.image === 'string') {
            // Evitar rutas temporales
            if (obra.image.includes('\\tmp\\') || obra.image.includes('C:\\')) {
                return '';
            }
            return `http://localhost:8000/storage/${obra.image}`;
        }
        
        return '';
    };
    
    const imageUrl = getImageUrl();
    
    useEffect(() => {
        if (!imageUrl) {
            setStatus('missing');
            return;
        }
        
        setStatus('loading');
        
        const img = new Image();
        let timeoutId;
        
        const handleLoad = () => {
            clearTimeout(timeoutId);
            setStatus('loaded');
        };
        
        const handleError = () => {
            clearTimeout(timeoutId);
            
            if (retryCount < 2) {
                // Reintentar después de un delay
                setTimeout(() => {
                    setRetryCount(prev => prev + 1);
                }, 1000 * (retryCount + 1));
            } else {
                setStatus('error');
            }
        };
        
        img.onload = handleLoad;
        img.onerror = handleError;
        img.src = imageUrl;
        
        // Timeout después de 10 segundos
        timeoutId = setTimeout(() => {
            if (status === 'loading') {
                setStatus('timeout');
            }
        }, 10000);
        
        return () => {
            clearTimeout(timeoutId);
        };
    }, [imageUrl, retryCount]);
    
    // Tamaños predefinidos
    const sizeClasses = {
        small: 'artwork-image-small',
        medium: 'artwork-image-medium',
        large: 'artwork-image-large',
        xlarge: 'artwork-image-xlarge'
    };
    
    // Placeholder según el estado
    const renderPlaceholder = () => {
        const placeholders = {
            loading: {
                emoji: '⏳',
                title: 'Cargando obra...',
                subtitle: 'Un momento por favor',
                color: '#4f46e5'
            },
            error: {
                emoji: '🖼️',
                title: 'Imagen no disponible',
                subtitle: obra?.title || 'Esta obra necesita una imagen',
                color: '#ef4444',
                action: true
            },
            missing: {
                emoji: '🎨',
                title: 'Sin imagen',
                subtitle: 'El artista aún no ha subido una imagen',
                color: '#f59e0b',
                action: true
            },
            timeout: {
                emoji: '⌛',
                title: 'Tiempo de carga agotado',
                subtitle: 'Intenta recargar la página',
                color: '#f59e0b'
            }
        };
        
        const placeholder = placeholders[status] || placeholders.error;
        
        return (
            <div 
                className={`artwork-image-placeholder ${sizeClasses[size]} ${hover ? 'placeholder-hover' : ''}`}
                style={{ 
                    background: `linear-gradient(135deg, ${placeholder.color}20, ${placeholder.color}10)`,
                    borderColor: `${placeholder.color}40`
                }}
                onMouseEnter={() => interactive && setHover(true)}
                onMouseLeave={() => interactive && setHover(false)}
                onClick={() => interactive && onImageClick?.()}
            >
                <div className="placeholder-content">
                    <div className="placeholder-emoji" style={{ color: placeholder.color }}>
                        {placeholder.emoji}
                    </div>
                    
                    <div className="placeholder-text">
                        <h4 className="placeholder-title" style={{ color: placeholder.color }}>
                            {placeholder.title}
                        </h4>
                        <p className="placeholder-subtitle">
                            {placeholder.subtitle}
                        </p>
                    </div>
                    
                    {placeholder.action && obra?.id_obra && (
                        <div className="placeholder-actions">
                            <a 
                                href={`/user/obras/edit/${obra.id_obra}`}
                                className="placeholder-btn"
                                style={{ 
                                    background: placeholder.color,
                                    color: 'white'
                                }}
                            >
                                <span className="btn-emoji">🔄</span>
                                <span className="btn-text">Subir imagen</span>
                            </a>
                        </div>
                    )}
                    
                    {/* Efecto de brillo en hover */}
                    {hover && interactive && (
                        <div className="placeholder-glow" style={{ background: placeholder.color }} />
                    )}
                </div>
                
                {/* Decoraciones */}
                <div className="placeholder-decoration">
                    <span className="decoration-dot" style={{ background: placeholder.color }} />
                    <span className="decoration-dot" style={{ background: placeholder.color }} />
                    <span className="decoration-dot" style={{ background: placeholder.color }} />
                </div>
            </div>
        );
    };
    
    // Información de la obra (opcional)
    const renderImageInfo = () => {
        if (!showInfo || !obra) return null;
        
        return (
            <div className="artwork-image-info">
                <div className="info-content">
                    <h4 className="info-title">{obra.title}</h4>
                    {obra.description && (
                        <p className="info-description">{obra.description}</p>
                    )}
                    <div className="info-meta">
                        {obra.category?.name && (
                            <span className="info-badge info-category">
                                {obra.category.name}
                            </span>
                        )}
                        {obra.emotion?.name && (
                            <span className="info-badge info-emotion">
                                {obra.emotion.icon} {obra.emotion.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };
    
    // Si la imagen está cargada, mostrar imagen
    if (status === 'loaded' && imageUrl) {
        return (
            <div 
                className={`artwork-image-container ${sizeClasses[size]} ${interactive ? 'interactive' : ''}`}
                onMouseEnter={() => interactive && setHover(true)}
                onMouseLeave={() => interactive && setHover(false)}
            >
                <div className="artwork-image-wrapper">
                    <img
                        src={imageUrl}
                        alt={obra?.title || 'Obra de arte'}
                        className={`artwork-image-real ${className} ${hover ? 'image-hover' : ''}`}
                        onClick={() => interactive && onImageClick?.()}
                        {...props}
                    />
                    
                    {/* Overlay en hover */}
                    {hover && interactive && (
                        <div className="artwork-image-overlay">
                            <div className="overlay-content">
                                <span className="overlay-icon">👁️</span>
                                <span className="overlay-text">Ver detalles</span>
                            </div>
                        </div>
                    )}
                    
                    {/* Efecto de marco */}
                    <div className="artwork-frame">
                        <div className="frame-corner corner-tl"></div>
                        <div className="frame-corner corner-tr"></div>
                        <div className="frame-corner corner-bl"></div>
                        <div className="frame-corner corner-br"></div>
                    </div>
                </div>
                
                {showInfo && renderImageInfo()}
            </div>
        );
    }
    
    // Si no, mostrar placeholder
    return (
        <div className={`artwork-image-container ${sizeClasses[size]}`}>
            {renderPlaceholder()}
            {showInfo && status === 'error' && renderImageInfo()}
        </div>
    );
};

// Propiedades por defecto
ArtworkImage.defaultProps = {
    size: 'medium',
    showInfo: false,
    interactive: false
};

export default ArtworkImage;