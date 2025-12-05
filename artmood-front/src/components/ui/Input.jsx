import React from 'react';
import './Input.css';

const Input = ({ 
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`ui-input ${fullWidth ? 'full-width' : ''} ${className}`}
      {...props}
    />
  );
};

export default Input;