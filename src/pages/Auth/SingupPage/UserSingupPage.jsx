import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/Auth/Authlayout';
import { Authcomponent } from '../../../components/Auth/Authcomponent';
import style from './UserSingupPage.module.css';
import { useToast } from '../../../context/ToastContext';

function UserSingupPage() {
  const [formData, setFormData] = useState({
    userName: '',
    phone: '',
    email: '',
    password: '',
    address: '',
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

  const handleUserSignup = (e) => {
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

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    localStorage.setItem('users', JSON.stringify([...existingUsers, formData]));

    showToast('회원가입이 완료되었습니다', 'success');
    alert('회원가입 완료');
    navigate('/login');
  };

  const handleEmailValid = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    if (!validateEmail(value)) {
      setEmailError('유효하지 않은 이메일 형식입니다.');
      return;
    }
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const isEmailTarget = existingUsers.some((user) => user.email === value);
    if (isEmailTarget) {
      setEmailError('이미 가입되어 있는 이메일입니다.');
    } else {
      setEmailError('사용가능한 이메일입니다.');
    }
  };

  return (
    <AuthLayout title="회원가입">
      <form
        onSubmit={handleUserSignup}
        style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
      >
        <Authcomponent
          label="이름"
          placeholder="이름"
          required={true}
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
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
        <Authcomponent label="주소" placeholder="주소" required={true} />

        <button
          type="submit"
          className={style.submit}
          onClick={handleUserSignup}
        >
          개인으로 회원가입
        </button>
      </form>
    </AuthLayout>
  );
}

export default UserSingupPage;
