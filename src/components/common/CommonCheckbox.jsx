import React, { useEffect, useRef } from 'react';
import styles from './CommonCheckbox.module.css';

function CommonCheckbox({
  id,
  checked = false,
  indeterminate = false,
  onChange,
  label,
  className = '',
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !checked;
    }
  }, [checked, indeterminate]);

  return (
    <div className={`${styles.wrapper} ${className}`.trim()}>
      <input
        ref={inputRef}
        id={id}
        type="checkbox"
        checked={checked}
        className={styles.input}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      {label ? (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      ) : null}
    </div>
  );
}

export default CommonCheckbox;
