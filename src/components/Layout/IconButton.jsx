import React from 'react';
import { useNavigate } from 'react-router-dom';

function IconButton({ label, path, Icon, className, onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }

    if (!e.defaultPrevented && path) {
      navigate(path);
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      {Icon && (
        <img
          src={Icon}
          alt={label}
          style={{
            width: '24px',
            height: '24px',
          }}
        />
      )}
      {label}
    </button>
  );
}

export default IconButton;
