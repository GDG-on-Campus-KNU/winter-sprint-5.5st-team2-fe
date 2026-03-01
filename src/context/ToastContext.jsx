import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import './Toast.css';
import successIcon from '../assets/success.png';
import errorIcon from '../assets/error.png';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

  const icons = {
    success: successIcon,
    error: errorIcon
  };
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: '',
    actions: [],
    duration: 3000,
  });
  const timeoutRef = useRef(null);

  const closeToast = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast({
      show: false,
      message: '',
      type: '',
      actions: [],
      duration: 3000,
    });
  };

  const showToast = (message, type = 'success', options = {}) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const actions = options.actions ?? [];
    const duration = options.duration ?? (actions.length > 0 ? 5000 : 3000);

    setToast({ show: true, message, type, actions, duration });

    timeoutRef.current = setTimeout(() => {
      closeToast();
    }, duration);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast.show && (
        <div
          className={`toast-container ${toast.type}`}
          style={{ animationDuration: `${toast.duration}ms` }}
        >
         {icons[toast.type] && (
            <img 
              src={icons[toast.type]} 
              alt={toast.type} 
              className="toast-icon-img" 
            />
          )}
          <p className="toast-message">{toast.message}</p>
          {toast.actions.length > 0 && (
            <div className="toast-actions">
              {toast.actions.map((action, index) => (
                <button
                  key={`${action.label}-${index}`}
                  type="button"
                  className={`toast-action-button ${action.variant ?? ''}`.trim()}
                  onClick={() => {
                    action.onClick?.();
                    if (action.closeOnClick !== false) {
                      closeToast();
                    }
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
