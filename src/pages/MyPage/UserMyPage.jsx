import React from 'react';
import { MOCK_DELIVERY } from '../../mocks/myPage.mock';

import styles from './UserMyPage.module.css';
import ProfileCard from '../../components/MyPage/ProfileCard';
import DeliveryStatusCard from '../../components/MyPage/DeliveryStatusCard';
import MyShoppingLinks from '../../components/MyPage/MyShoppingLinks';

import useRequireAuth from '../../hooks/useRequireAuth';
import useAuthStore from '../../store/useAuthStore';

export default function UserMyPage() {
  const user = useAuthStore((s) => s.user);
  const isAllowed = useRequireAuth({
    redirectTo: '/login',
    message: '로그인이 필요합니다.',
    types: 'error',
  });

  if (!isAllowed) return null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>마이페이지</h1>
      <div className={styles.container}>
        <section className={styles.section}>
          <ProfileCard user={user} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.secutionTitle}>배송 현황</h2>
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
