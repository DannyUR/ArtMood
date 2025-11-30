// components/follow/FollowButton.jsx
import React, { useState, useEffect } from 'react';
import { followerService } from '../../services/followerService';
import { useAuth } from '../../context/AuthContext';

const FollowButton = ({ userId, userNombre }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // No mostrar botón si es el propio usuario
  if (user.id === userId) return null;

  useEffect(() => {
    verificarSeguimiento();
  }, [userId]);

  const verificarSeguimiento = async () => {
    try {
      const following = await followerService.checkFollow(userId);
      setIsFollowing(following);
    } catch (error) {
      console.error('Error verificando seguimiento:', error);
    }
  };

  const handleFollow = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      if (isFollowing) {
        // Dejar de seguir
        await followerService.unfollow(userId);
        setIsFollowing(false);
        console.log(`❌ Dejaste de seguir a ${userNombre}`);
      } else {
        // Seguir
        await followerService.follow(userId);
        setIsFollowing(true);
        console.log(`✅ Ahora sigues a ${userNombre}`);
      }
    } catch (error) {
      console.error('Error en seguimiento:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`follow-btn ${isFollowing ? 'following' : 'not-following'}`}
    >
      {loading ? '...' : isFollowing ? 'Dejar de seguir' : 'Seguir'}
    </button>
  );
};

export default FollowButton;