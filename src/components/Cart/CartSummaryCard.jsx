import React from 'react';
import CommonButton from '../common/CommonButton';
import styles from './CartSummaryCard.module.css';

function CartSummaryCard({
  selectedItemCount,
  subtotal,
  shippingFee,
  total,
  discountAmount = null,
  onCheckout,
  onContinueShopping,
  title = '주문 요약',
  showSelectionLabel = true,
  subtotalLabel = '상품 금액',
  discountLabel = '쿠폰 할인',
  shippingLabel = '배송비',
  totalLabel = '결제 예정 금액',
  checkoutLabel = '주문하기',
  continueLabel = '계속 쇼핑하기',
  showContinueButton = true,
  sticky = true,
  disableCheckout,
  checkoutButtonFullWidth = true,
  className = '',
  checkoutButtonClassName = '',
  continueButtonClassName = '',
}) {
  const isCheckoutDisabled = disableCheckout ?? selectedItemCount === 0;
  const showDiscountRow = discountAmount !== null;
  const rootClasses = [
    styles.summaryCard,
    !sticky ? styles.nonSticky : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={rootClasses}>
      <h2 className={styles.summaryTitle}>{title}</h2>
      {showSelectionLabel ? (
        <p className={styles.selectionLabel}>선택 상품 {selectedItemCount}개</p>
      ) : null}
      <div className={styles.summaryRow}>
        <span>{subtotalLabel}</span>
        <strong>{subtotal.toLocaleString()}원</strong>
      </div>
      {showDiscountRow ? (
        <div className={styles.summaryRow}>
          <span>{discountLabel}</span>
          <strong>{discountAmount.toLocaleString()}원</strong>
        </div>
      ) : null}
      <div className={styles.summaryRow}>
        <span>{shippingLabel}</span>
        <strong>{shippingFee.toLocaleString()}원</strong>
      </div>
      <div className={`${styles.summaryRow} ${styles.totalRow}`}>
        <span>{totalLabel}</span>
        <strong>{total.toLocaleString()}원</strong>
      </div>
      <CommonButton
        fullWidth={checkoutButtonFullWidth}
        onClick={onCheckout}
        disabled={isCheckoutDisabled}
        className={checkoutButtonClassName}
      >
        {checkoutLabel}
      </CommonButton>
      {showContinueButton ? (
        <CommonButton
          variant="secondary"
          fullWidth
          onClick={onContinueShopping}
          className={`${styles.continueButton} ${continueButtonClassName}`.trim()}
        >
          {continueLabel}
        </CommonButton>
      ) : null}
    </aside>
  );
}

export default CartSummaryCard;
