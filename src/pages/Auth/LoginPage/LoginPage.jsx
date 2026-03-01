import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';
import AuthLayout from '../../../components/Auth/Authlayout';
import style from './LoginPage.module.css';
import { useToast } from '../../../context/ToastContext';
import { MOCK_ADMIN_DATA } from '../../../mocks/admin';
import { getMyProfile, login as loginApi } from '../../../api/auth';
import { shouldUseMock } from '../../../api/client';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const showToast = useToast();
  const { adminLogin } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      let loggedInUser = null;

      if (shouldUseMock) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const admins = JSON.parse(localStorage.getItem('admins') || '[]');
        const account = [...users, ...admins].find(
          (item) => item.email === email && item.password === password,
        );

        if (!account) {
          throw new Error('Invalid credentials');
        }

        loggedInUser = {
          id: account.id ?? Date.now(),
          role: account.role ?? 'USER',
          name: account.userName ?? account.name ?? account.store ?? '사용자',
          email: account.email,
        };
      } else {
        await loginApi({ email, password });
        const profile = await getMyProfile();
        loggedInUser = profile;
      }

      if (!loggedInUser) throw new Error('로그인 정보를 가져올 수 없습니다.');

      setAuth(loggedInUser);

      if (loggedInUser.role === 'ADMIN') {
        adminLogin(MOCK_ADMIN_DATA);
      }

      showToast(`${loggedInUser.name || '사용자'}님, 환영합니다!`, 'success');

      setTimeout(() => {
        if (loggedInUser.role === 'ADMIN') {
          navigate('/mypage/admin');
        } else {
          navigate('/');
        }
      }, 100);
    } catch (error) {
      console.error(error);
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
