import { forwardRef } from 'react';
import './IconButton.css';

const IconButton = forwardRef(({
  icon,
  variant = 'ghost',
  size = 'medium',
  disabled = false,
  onClick,
  ariaLabel,
  tooltip,
  className = '',
  ...props
}, ref) => {
  const buttonClasses = [
    'icon-btn',
    `icon-btn-${variant}`,
    `icon-btn-${size}`,
    disabled && 'icon-btn-disabled',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={tooltip || ariaLabel}
      {...props}
    >
      <span className="icon-btn-icon" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
});

IconButton.displayName = 'IconButton';

export default IconButton;
