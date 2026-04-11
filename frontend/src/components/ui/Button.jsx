import { forwardRef } from 'react';
import './Button.css';

const Button = forwardRef(({
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  children,
  ariaLabel,
  tooltip,
  type = 'button',
  className = '',
  ...props
}, ref) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    loading && 'btn-loading',
    disabled && 'btn-disabled',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : undefined)}
      title={tooltip}
      {...props}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true">
          <span className="spinner-icon"></span>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left" aria-hidden="true">
          {icon}
        </span>
      )}
      
      {children && (
        <span className="btn-content">
          {children}
        </span>
      )}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right" aria-hidden="true">
          {icon}
        </span>
      )}
      
      <span className="btn-ripple" aria-hidden="true"></span>
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
