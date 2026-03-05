import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavButton({ label, path, className, onClick }) {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented) {
      navigate(path);
    }
  };
  return (
    <button className={className} onClick={handleClick}>
      {label}
    </button>
  );
}

export default NavButton;
