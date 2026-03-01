import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/Auth/Authlayout';
import { Authcomponent } from '../../../components/Auth/Authcomponent';
import style from './UserSingupPage.module.css';
import { useToast } from '../../../context/ToastContext';
import { checkEmail, signupAdmin } from '../../../api/auth';
import { shouldUseMock } from '../../../api/client';

function AdminSingupPage() {
  const [formData, setFormData] = useState({
    store: '',
    phone: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const showToast = useToast();

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorEmail, setEmailError] = useState('');

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const isLongEnough = formData.password.length >= 10;

  const handleAdminSignup = async (e) => {
    e.preventDefault();
    // 1. 이메일 상태 최종 확인
    if (errorEmail !== '사용가능한 이메일입니다.') {
      showToast('이메일을 확인해주세요.', 'error');
      return;
    }

    // 2. 비밀번호 일치 확인
    if (formData.password !== confirmPassword) {
      showToast('비밀번호가 일치하지 않습니다.', 'error');
      return;
    }

    // 3. 비밀번호 길이 확인
    if (!isLongEnough) {
      showToast('비밀번호는 10자 이상이어야 합니다.', 'error');
      return;
    }

    try {
      if (shouldUseMock) {
        const admins = JSON.parse(localStorage.getItem('admins') || '[]');
        admins.push({
          ...formData,
          id: Date.now(),
          role: 'ADMIN',
          name: formData.store,
        });
        localStorage.setItem('admins', JSON.stringify(admins));
      } else {
        await signupAdmin(formData);
      }
      showToast('회원가입이 완료되었습니다', 'success');
      navigate('/login');
    } catch {
      showToast('회원가입에 실패했습니다.', 'error');
    }
  };

  const handleEmailValid = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    if (!validateEmail(value)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      return;
    }
    try {
      if (shouldUseMock) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const admins = JSON.parse(localStorage.getItem('admins') || '[]');
        const exists = [...users, ...admins].some(
          (item) => item.email === value,
        );
        setEmailError(
          exists
            ? '이미 가입되어 있는 이메일입니다.'
            : '사용가능한 이메일입니다.',
        );
      } else {
        const data = await checkEmail(value);
        setEmailError(
          data?.isAvailable
            ? '사용가능한 이메일입니다.'
            : '이미 가입되어 있는 이메일입니다.',
        );
      }
    } catch {
      setEmailError('이메일 확인에 실패했습니다.');
    }
  };

  return (
    <AuthLayout title="회원가입">
      <form
        onSubmit={handleAdminSignup}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <Authcomponent
          label="스토어명"
          placeholder="스토어명"
          required={true}
          value={formData.store}
          onChange={(e) => setFormData({ ...formData, store: e.target.value })}
        />
        <Authcomponent
          label="이메일"
          placeholder="이메일 입력"
          required={true}
          type="email"
          onChange={handleEmailValid}
        />
        <span
          style={{
            fontSize: '14px',
            color:
              errorEmail === '사용가능한 이메일입니다.' ? '#1996D6' : '#FF4848',
            textAlign: 'right',
          }}
        >
          {errorEmail}
        </span>
        <Authcomponent
          label="비밀번호"
          placeholder="비밀번호 입력"
          value={formData.password}
          required={true}
          type="password"
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <span
          style={{
            fontSize: '14px',
            color: isLongEnough ? '#1996D6' : '#FF4848',
            textAlign: 'right',
          }}
        >
          최소 10자 이상
        </span>

        <Authcomponent
          label="비밀번호 재입력"
          placeholder="비밀번호 재입력"
          required={true}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {confirmPassword && formData.password !== confirmPassword && (
          <span
            style={{ color: '#FF4848', fontSize: '14px', textAlign: 'right' }}
          >
            비밀번호가 일치하지 않습니다.
          </span>
        )}
        {confirmPassword && formData.password === confirmPassword && (
          <span
            style={{ color: '#1996D6', fontSize: '14px', textAlign: 'right' }}
          >
            비밀번호가 일치합니다.
          </span>
        )}
        <Authcomponent
          label="전화번호"
          placeholder="010-0000-0000"
          required={true}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        <button type="submit" className={style.submit}>
          스토어 관리자로 회원가입
        </button>
      </form>
    </AuthLayout>
  );
}

export default AdminSingupPage;
