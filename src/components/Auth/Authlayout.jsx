import React from 'react';
import style from './AuthLayout.module.css';

function AuthLayout({ title, children }) {
  return (
    <div className={style.container}>
      <h1 className={style.title}>{title}</h1>
      <div className={style.content}>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;