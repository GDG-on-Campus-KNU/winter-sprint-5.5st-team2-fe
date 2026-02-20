import React, { createContext, useContext, useState } from 'react';
import './Toast.css';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast.show && (
        <div className={`toast-container ${toast.type}`}>{toast.message}</div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
