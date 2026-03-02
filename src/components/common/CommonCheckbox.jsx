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
      // 일부 선택 상태 제어
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
        className={styles.styledInput}
        onChange={(event) => onChange?.(event.target.checked)}
      />
      {label && (
        <label htmlFor={id} className={styles.labelText}>
          {label}
        </label>
      )}
    </div>
  );
}

export default CommonCheckbox;
