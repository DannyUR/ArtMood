// components/ui/Card.jsx
import React from 'react';

const Card = ({ 
  children, 
  className = '',
  padding = 'medium',
  shadow = 'medium',
  hover = false,
  onClick,
  style = {}
}) => {
  const paddingSizes = {
    none: '0',
    small: '1rem',
    medium: '1.5rem',
    large: '2rem'
  };

  const shadowSizes = {
    none: 'none',
    small: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.12)',
    large: '0 8px 16px rgba(0,0,0,0.15)'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: paddingSizes[padding],
    boxShadow: shadowSizes[shadow],
    transition: hover ? 'all 0.3s ease' : 'none',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  const hoverStyle = hover ? {
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
    }
  } : {};

  return (
    <div 
      className={`card ${className}`}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
      
      <style>
        {`
          .card:hover {
            ${hoverStyle[':hover'] ? `
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            ` : ''}
          }
        `}
      </style>
    </div>
  );
};

export default Card;