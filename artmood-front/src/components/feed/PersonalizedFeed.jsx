// components/feed/PersonalizedFeed.jsx
import React, { useState, useEffect } from 'react';
import { obraService } from '../../services/obraService';
import { followerService } from '../../services/followerService';

const PersonalizedFeed = () => {
  const [obras, setObras] = useState([]);
  const [feedType, setFeedType] = useState('seguidos'); // 'seguidos' o 'descubrir'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFeed();
  }, [feedType]);

  const loadFeed = async () => {
    setLoading(true);
    try {
      let response;
      
      if (feedType === 'seguidos') {
        response = await obraService.getFeedSeguidos();
      } else {
        response = await obraService.getDiscover();
      }
      
      setObras(response.data);
    } catch (error) {
      console.error('Error cargando feed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="personalized-feed">
      <div className="feed-header">
        <h2>Tu Galería</h2>
        <div className="feed-tabs">
          <button 
            className={feedType === 'seguidos' ? 'active' : ''}
            onClick={() => setFeedType('seguidos')}
          >
            👥 Siguiendo
          </button>
          <button 
            className={feedType === 'descubrir' ? 'active' : ''}
            onClick={() => setFeedType('descubrir')}
          >
            🔍 Descubrir
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando obras...</div>
      ) : (
        <div className="feed-grid">
          {obras.map(obra => (
            <div key={obra.id_obra} className="feed-item">
              <img src={obra.imagen} alt={obra.titulo} />
              <div className="obra-info">
                <h3>{obra.titulo}</h3>
                <p>Por: {obra.usuario?.nombre}</p>
                {obra.emocion && (
                  <span className="obra-emotion">
                    {obra.emocion.icono} {obra.emocion.nombre_emocion}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalizedFeed;