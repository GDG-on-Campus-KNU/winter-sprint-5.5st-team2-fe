import React from 'react';
import '../../global.css';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { MOCK_DELIVERY } from '../../mocks/myPage.mock';

import styles from './UserMyPage.module.css';
import ProfileCard from '../../components/MyPage/ProfileCard';
import DeliveryStatusCard from '../../components/MyPage/DeliveryStatusCard';
import MyShoppingLinks from '../../components/MyPage/MyShoppingLinks';
import useAuthStore from '../../store/useAuthStore';

export default function UserMyPage() {
  const showToast = useToast();
  const navigate = useNavigate();
  const hasShownRef = useRef(false);

  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) {
      if (!hasShownRef.current) {
        showToast('로그인이 필요합니다.', 'error');
        hasShownRef.current = true;
        navigate('/login');
      }
    }
  }, [isLoggedIn, user, showToast, navigate]);

  if (!isLoggedIn || !user) return null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>마이페이지</h1>
      <div className={styles.container}>
        <section className={styles.section}>
          <ProfileCard user={user} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>배송 현황</h2>
          <DeliveryStatusCard delivery={MOCK_DELIVERY} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>나의 쇼핑</h2>
          <MyShoppingLinks />
        </section>
      </div>
    </div>
  );
}
