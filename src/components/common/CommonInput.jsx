import React from 'react';
import styles from './CommonInput.module.css';

function CommonInput({
  id,
  label,
  required = false,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  suffix,
  className = '',
  inputClassName = '',
}) {
  return (
    <div className={`${styles.field} ${className}`.trim()}>
      {label ? (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required ? <span className={styles.required}>*</span> : null}
        </label>
      ) : null}

      <div className={styles.inputRow}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`${styles.input} ${inputClassName}`.trim()}
        />
        {suffix ? <div className={styles.suffix}>{suffix}</div> : null}
      </div>
    </div>
  );
}

export default CommonInput;
