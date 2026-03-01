import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import useAuthStore from '../store/useAuthStore';

export default function useRequireAuth(options = {}) {
  const {
    redirectTo = '/login',
    message = '로그인이 필요합니다.',
    type = 'error',
  } = options;

  const showToast = useToast();
  const navigate = useNavigate();
  const hasShownRef = useRef(false);

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    // 로그인 안 된 상태면 1회만 토스트 띄우고 이동
    if (!isLoggedIn) {
      if (!hasShownRef.current) {
        showToast(message, type);
        hasShownRef.current = true;
        navigate(redirectTo);
      }
    }
  }, [isLoggedIn, showToast, navigate, redirectTo, message, type]);

  // 마이페이지처럼 user까지 필요하면 여기서 같이 체크해도 됨
  return Boolean(isLoggedIn && user);
}
