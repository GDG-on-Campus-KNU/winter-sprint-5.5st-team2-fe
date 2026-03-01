import React from 'react';
import styles from './CouponListItem.module.css';

function formatDate(dateString) {
  const d = new Date(dateString);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

function getDiscountText(coupon) {
  if (coupon.discountType === 'PERCENT') {
    return `전 상품 ${coupon.discountValue}% 할인`;
  }
  if (coupon.discountType === 'FIXED') {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  }
  return '';
}

export default function CouponListItem({ coupon }) {
  return (
    <li className={styles.item}>
      <div className={styles.topRow}>
        <div className={styles.name}>{coupon.couponName}</div>
      </div>

      <div className={styles.desc}>{getDiscountText(coupon)}</div>
      <div className={styles.meta}>
        유효기간 {formatDate(coupon.expiryDate)}까지
      </div>
    </li>
  );
}
