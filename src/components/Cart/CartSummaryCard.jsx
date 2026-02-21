import React from 'react';
import CommonButton from '../common/CommonButton';
import styles from './CartSummaryCard.module.css';

function CartSummaryCard({
  selectedItemCount,
  subtotal,
  shippingFee,
  total,
  onCheckout,
  onContinueShopping,
}) {
  const isCheckoutDisabled = selectedItemCount === 0;

  return (
    <aside className={styles.summaryCard}>
      <h2 className={styles.summaryTitle}>주문 요약</h2>
      <p className={styles.selectionLabel}>선택 상품 {selectedItemCount}개</p>
      <div className={styles.summaryRow}>
        <span>상품 금액</span>
        <strong>{subtotal.toLocaleString()}원</strong>
      </div>
      <div className={styles.summaryRow}>
        <span>배송비</span>
        <strong>{shippingFee.toLocaleString()}원</strong>
      </div>
      <div className={`${styles.summaryRow} ${styles.totalRow}`}>
        <span>결제 예정 금액</span>
        <strong>{total.toLocaleString()}원</strong>
      </div>
      <CommonButton
        fullWidth
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
      >
        주문하기
      </CommonButton>
      <CommonButton
        variant="secondary"
        fullWidth
        onClick={onContinueShopping}
        className={styles.continueButton}
      >
        계속 쇼핑하기
      </CommonButton>
    </aside>
  );
}

export default CartSummaryCard;
