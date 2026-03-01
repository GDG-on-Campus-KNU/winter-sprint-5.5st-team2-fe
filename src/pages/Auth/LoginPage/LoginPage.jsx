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
        await loginApi({ email, password });
        const profile = await getMyProfile();
        setAuth(profile ?? null);
        showToast(
          `${profile?.userName || profile?.name || '사용자'}님, 환영합니다!`,
          'success',
        );
      }

      showToast(`${account.userName || '사용자'}님, 환영합니다!`, 'success');

      setTimeout(() => {
        if (foundAdmin) {
          adminLogin(MOCK_ADMIN_DATA);
          console.log(MOCK_ADMIN_DATA);
          navigate('/mypage/admin');
          showToast('관리자님, 환영합니다!', 'success');
        } else {
          navigate('/');
        }
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
