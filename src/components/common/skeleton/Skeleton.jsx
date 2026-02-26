import React from 'react';
import style from './Skeleton.module.css';

const Skeleton = ({ width, height, borderRadius = '8px', className }) => {
  return (
    <div 
      className={`${style.shimmer} ${className}`} 
      style={{ width, height, borderRadius }}
    />
  );
};

export default Skeleton;