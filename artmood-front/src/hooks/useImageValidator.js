// hooks/useImageValidator.js
import { useState, useEffect } from 'react';

export const useImageValidator = (imageUrl, obraId) => {
    const [status, setStatus] = useState('loading');
    const [validUrl, setValidUrl] = useState('');
    
    useEffect(() => {
        let isMounted = true;
        
        const validateImage = async () => {
            if (!imageUrl) {
                if (isMounted) {
                    setStatus('missing');
                    setValidUrl('');
                }
                return;
            }
            
            try {
                // Primero intentar cargar la imagen
                const img = new Image();
                
                img.onload = () => {
                    if (isMounted) {
                        setStatus('loaded');
                        setValidUrl(imageUrl);
                    }
                };
                
                img.onerror = async () => {
                    // Si falla, verificar con fetch
                    try {
                        const response = await fetch(imageUrl, { method: 'HEAD' });
                        if (response.ok && isMounted) {
                            setStatus('loaded');
                            setValidUrl(imageUrl);
                        } else {
                            throw new Error('Image not found');
                        }
                    } catch (error) {
                        if (isMounted) {
                            setStatus('error');
                            setValidUrl('');
                            
                            // Reportar al backend
                            reportMissingImage(obraId, imageUrl);
                        }
                    }
                };
                
                img.src = imageUrl;
                
                // Timeout después de 5 segundos
                setTimeout(() => {
                    if (isMounted && status === 'loading') {
                        setStatus('timeout');
                        setValidUrl('');
                    }
                }, 5000);
                
            } catch (error) {
                if (isMounted) {
                    setStatus('error');
                    setValidUrl('');
                }
            }
        };
        
        validateImage();
        
        return () => {
            isMounted = false;
        };
    }, [imageUrl, obraId]);
    
    return { status, validUrl };
};

const reportMissingImage = async (obraId, imageUrl) => {
    try {
        await fetch(`/api/obras/${obraId}/report-missing-image`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl })
        });
    } catch (error) {
        console.error('Error reporting missing image:', error);
    }
};