import React from 'react';
import styles from './ProfileCard.module.css';
import ProfileImg from '../../assets/defaultProfileImg.jpg';

export default function ProfileCard({ user, onCouponClick }) {
  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <img src={ProfileImg} alt="profile" className={styles.image} />
      </div>

      <div className={styles.center}>
        <div className={styles.name}>
          {user.userName ?? '사용자'}
          <span className={styles.suffix}>님</span>
        </div>
        <button
          className={styles.couponBtn}
          onClick={onCouponClick}
          type="button"
        >
          쿠폰함
        </button>
      </div>
    </div>
  );
}
