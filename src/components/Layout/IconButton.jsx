import React from 'react';
import { useNavigate } from 'react-router-dom';

function IconButton({ label, path, Icon, className, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (label === '로그아웃') {
      if (onClick) onClick();
    } else if (path) {
      navigate(path);
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      {Icon && (
        <img
          src={Icon}
          alt={label}
          sytle={{
            width: '24px',
            hegiht: '24px',
          }}
        />
      )}
      {label}
    </button>
  );
}

export default IconButton;
