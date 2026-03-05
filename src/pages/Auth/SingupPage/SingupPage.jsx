import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './SingupPage.module.css';
import AuthLayout from '../../../components/Auth/Authlayout';

function SingupPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('personal');

  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  const handleNextPage = () => {
    if (role === 'admin') {
      navigate('/signup/admin');
    } else {
      navigate('/signup/personal');
    }
  };

  return (
    <AuthLayout title="회원가입">
      <div className={style.selectionWrapper}>
        <p style={{ color: '#575757', fontSize: '14px' }}>
          가입 목적 <span style={{ color: '#FF4848' }}>*</span>
        </p>

        <div className={style.selectionrole}>
          <input
            type="radio"
            id="personal"
            name="role"
            value="personal"
            onChange={handleRoleChange}
            defaultChecked
          />
          <label htmlFor="personal">개인</label>
          <input
            type="radio"
            id="admin"
            name="role"
            value="admin"
            onChange={handleRoleChange}
          />
          <label htmlFor="admin">스토어 관리자</label>
        </div>
      </div>

      <button className={style.nextButton} onClick={handleNextPage}>
        다음
      </button>
    </AuthLayout>
  );
}

export default SingupPage;
