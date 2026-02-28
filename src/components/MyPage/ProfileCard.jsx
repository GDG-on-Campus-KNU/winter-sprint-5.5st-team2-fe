import React from 'react';
import styles from './ProfileCard.module.css';
import ProfileImg from '../../assets/defaultProfileImg.jpg';

export default function ProdileCard({ user }) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <img src={ProfileImg} alt="profile" className={styles.image} />
      </div>

      <div className={styles.center}>
        <div className={styles.name}>{user.userName}님</div>
        <button className={styles.couponBtn}>쿠폰함</button>
      </div>
    </div>
  );
}
