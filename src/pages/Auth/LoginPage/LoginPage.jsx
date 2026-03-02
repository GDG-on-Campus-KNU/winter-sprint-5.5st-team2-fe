import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';
import useCartStore from '../../../store/useCartStore';
import AuthLayout from '../../../components/Auth/Authlayout';
import style from './LoginPage.module.css';
import { useToast } from '../../../context/ToastContext';
import { login as loginApi } from '../../../api/auth';
import { getCart } from '../../../api/cart';
import { shouldUseMock } from '../../../api/client';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuthStore();
  const setCartItems = useCartStore((state) => state.setCartItems);
  const navigate = useNavigate();

  const showToast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (shouldUseMock) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const admins = JSON.parse(localStorage.getItem('admins') || '[]');
        const account = [...users, ...admins].find(
          (item) => item.email === email && item.password === password,
        );

        if (!account) {
          throw new Error('Invalid credentials');
        }

        const normalizedUser = {
          id: account.id ?? Date.now(),
          role: account.role ?? 'USER',
          name: account.userName ?? account.name ?? account.store ?? '사용자',
          email: account.email,
        };
        setAuth(normalizedUser);
        showToast(`${normalizedUser.name}님, 환영합니다!`, 'success');
      } else {
        const data = await loginApi({ email, password });
        setAuth(data?.user ?? null);
        const serverCart = await getCart();
        const serverCartItems = Array.isArray(serverCart)
          ? serverCart
          : (serverCart?.cartItems ?? serverCart?.items ?? []);
        setCartItems(serverCartItems);

        showToast(`${data?.user?.name || '사용자'}님, 환영합니다!`, 'success');
      }

      setTimeout(() => {
        navigate('/');
      }, 100);
    } catch {
      showToast('이메일 또는 비밀번호를 확인해주세요', 'error');
    }
  };

  return (
    <div>
      <AuthLayout title="로그인">
        <form className={style.inputGroup} onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 입력"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 입력"
            required
          />
          <button className={style.inputbutton} type="submit">
            로그인
          </button>
        </form>
      </AuthLayout>
      <div className={style.join}>
        처음이신가요?{' '}
        <span
          onClick={() => {
            navigate('/singup');
          }}
        >
          회원가입
        </span>
      </div>
    </div>
  );
}

export default LoginPage;
