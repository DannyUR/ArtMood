// TextArea.jsx - Añade export nombrado además del default
const TextArea = ({ 
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  fullWidth = false,
  className = '',
  maxLength,
  ...props
}) => {
  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      required={required}
      disabled={disabled}
      className={`ui-textarea ${fullWidth ? 'full-width' : ''} ${className}`}
      maxLength={maxLength}
      {...props}
    />
  );
};

// Exporta ambos
export default TextArea;
export { TextArea }; // ← Añade esta línea para export nombrado