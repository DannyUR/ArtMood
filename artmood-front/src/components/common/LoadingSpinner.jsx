// components/common/LoadingSpinner.jsx
import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = '#6200ee', 
  text = 'Cargando...',
  fullScreen = false
}) => {
  const sizes = {
    small: '1.5rem',
    medium: '2.5rem',
    large: '4rem'
  };

  const spinnerContent = (
    <div className={`loading-spinner-container ${fullScreen ? 'full-screen' : ''}`}>
      <div 
        className="spinner"
        style={{
          width: sizes[size],
          height: sizes[size],
          borderColor: color
        }}
      />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );

  return spinnerContent;
};

export default LoadingSpinner;