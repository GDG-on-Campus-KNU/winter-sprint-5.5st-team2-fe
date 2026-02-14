import React from 'react';
import { useNavigate } from 'react-router-dom';

function NavButton({ label, path, className }) {
  const navigate = useNavigate();
  return (
    <button className={className} onClick={() => navigate(path)}>
      {label}
    </button>
  );
}

export default NavButton;
