import React from 'react';
import styles from './CommonButton.module.css';

function CommonButton({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  onClick,
  icon,
  className = '',
}) {
  const classes = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
    >
      <span className={styles.content}>
        {icon}
        {children}
      </span>
    </button>
  );
}

export default CommonButton;
