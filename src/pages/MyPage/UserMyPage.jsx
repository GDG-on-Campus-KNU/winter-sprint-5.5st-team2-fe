import React, { useEffect, useState } from 'react';
import { getMyCoupons } from '../../api/coupons';
import { MOCK_DELIVERY } from '../../mocks/myPage.mock';

import styles from './UserMyPage.module.css';
import ProfileCard from '../../components/MyPage/ProfileCard';
import DeliveryStatusCard from '../../components/MyPage/DeliveryStatusCard';
import MyShoppingLinks from '../../components/MyPage/MyShoppingLinks';
import CouponModal from '../../components/common/CouponModal';

import useRequireAuth from '../../hooks/useRequireAuth';
import useAuthStore from '../../store/useAuthStore';

export default function UserMyPage() {
  const user = useAuthStore((s) => s.user);
  const isAllowed = useRequireAuth({
    redirectTo: '/login',
    message: '로그인이 필요합니다.',
    types: 'error',
  });

  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCoupons = async () => {
      try {
        const data = await getMyCoupons(controller.signal);
        setCoupons(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setCoupons([]);
        }
      }
    };

    fetchCoupons();

    return () => controller.abort();
  }, []);

  if (!isAllowed) return null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>마이페이지</h1>
      <div className={styles.container}>
        <section className={styles.section}>
          <ProfileCard
            user={user}
            onCouponClick={() => setIsCouponOpen(true)}
          />
        </section>

        <section className={styles.section}>
          {/* 오타 주의: secutionTitle -> sectionTitle */}
          <h2 className={styles.sectionTitle}>배송 현황</h2>
          <DeliveryStatusCard delivery={MOCK_DELIVERY} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>나의 쇼핑</h2>
          <MyShoppingLinks />
        </section>
      </div>

      <CouponModal
        open={isCouponOpen}
        onClose={() => setIsCouponOpen(false)}
        coupons={coupons}
        selectable={false}
      />
    </div>
  );
}
