// components/ui/Button.jsx
import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    fontFamily: 'inherit',
    outline: 'none',
    opacity: disabled ? 0.6 : 1
  };

  const variants = {
    primary: {
      background: '#6200ee',
      color: 'white',
      border: '1px solid #6200ee'
    },
    secondary: {
      background: 'transparent',
      color: '#6200ee',
      border: '1px solid #6200ee'
    },
    danger: {
      background: '#dc3545',
      color: 'white',
      border: '1px solid #dc3545'
    },
    success: {
      background: '#28a745',
      color: 'white',
      border: '1px solid #28a745'
    },
    ghost: {
      background: 'transparent',
      color: '#666',
      border: '1px solid transparent'
    }
  };

  const sizes = {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem'
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem'
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem'
    }
  };

  const style = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size]
  };

  return (
    <button
      type={type}
      style={style}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn ${className}`}
      {...props}
    >
      {loading && (
        <span 
          style={{
            width: '16px',
            height: '16px',
            border: '2px solid transparent',
            borderTop: `2px solid currentColor`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      )}
      {children}
    </button>
  );
};

export default Button;