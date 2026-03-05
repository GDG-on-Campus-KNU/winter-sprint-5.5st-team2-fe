import React from 'react';
import style from './Authcomponent.module.css';

export const Authcomponent = ({
  label,
  placeholder,
  required,
  type = 'text',
  ...props
}) => (
  <div className={style.inputWrapper}>
    <label className={style.label}>
      {label}
      {required && <span style={{ color: '#FF4848' }}> *</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      {...props}
      className={style.input}
    />
  </div>
);
