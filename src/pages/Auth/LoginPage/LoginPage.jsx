import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';
import AuthLayout from '../../../components/Auth/Authlayout';
import style from './LoginPage.module.css';
import { useToast } from '../../../context/ToastContext';
import { MOCK_ADMIN_DATA } from '../../../mocks/admin';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAutoLogin, setIsAutoLogin] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const showToast = useToast();
  const { adminLogin } = useAuthStore();

  const handleLogin = (e) => {
    e.preventDefault();

    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const savedAdmins = JSON.parse(localStorage.getItem('admins') || '[]');

    const foundUser = savedUsers.find(
      (u) => u.email === email && u.password === password,
    );
    const foundAdmin = savedAdmins.find(
      (u) => u.email === email && u.password === password,
    );

    // 1. 어떤 계정인지 확인
    const account = foundUser || foundAdmin;

    if (account) {
      login(account);
      if (isAutoLogin) {
        localStorage.setItem('autoLoginUser', JSON.stringify(account));
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
    } else {
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

          <div className={style.autoLoginWrapper}>
            <input
              type="checkbox"
              checked={isAutoLogin}
              id="autoLogin"
              onChange={(e) => setIsAutoLogin(e.target.checked)}
            />
            <label>자동 로그인</label>
          </div>

          <button className={style.inputbutton} type="submit">
            로그인
          </button>
        </form>
      </AuthLayout>
      <div className={style.join}>
        처음이신가요?{' '}
        <span
          onClick={() => {
            navigate('/sing');
          }}
        >
          회원가입
        </span>
      </div>
    </div>
  );
}

export default LoginPage;
