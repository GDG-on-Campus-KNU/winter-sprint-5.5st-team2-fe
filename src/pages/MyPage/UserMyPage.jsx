import React from 'react';
import styles from './MyPage.module.css';
import useAuthStore from '../../store/useAuthStore';

export default function UserMyPage() {
  const user = useAuthStore((s) => s.user);
  const isLogin = useAuthStore((s) => s.isLogin);

  if (!isLogin) return console.log('로그인이 필요합니다');

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>마이페이지</h1>

        <ProfileCard user={user} />
      </div>
    </div>
  );
}
