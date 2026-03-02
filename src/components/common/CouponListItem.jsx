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
  const discountType = String(coupon.discountType ?? '').toUpperCase();

  if (discountType === 'PERCENT') {
    return `전 상품 ${coupon.discountValue}% 할인`;
  }
  if (discountType === 'FIXED') {
    return `${coupon.discountValue.toLocaleString()}원 할인`;
  }
  return '';
}

export default function CouponListItem({
  coupon,
  disabled = false,
  isSelected = false,
  selectable = true,
  onSelect,
}) {
  return (
    <li className={`${styles.item} ${isSelected ? styles.selectedItem : ''}`.trim()}>
      <div className={styles.topRow}>
        <div className={styles.name}>{coupon.couponName}</div>
        {selectable ? (
          <button
            type="button"
            className={`${styles.selectButton} ${isSelected ? styles.selectedButton : ''}`.trim()}
            onClick={onSelect}
            disabled={disabled}
          >
            {disabled ? '사용불가' : isSelected ? '선택됨' : '선택'}
          </button>
        ) : null}
      </div>

      <div className={styles.desc}>{getDiscountText(coupon)}</div>
      <div className={styles.meta}>유효기간 {formatDate(coupon.expiryDate)}까지</div>
    </li>
  );
}
