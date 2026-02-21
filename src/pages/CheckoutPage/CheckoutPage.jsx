import React, { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CartSummaryCard from '../../components/Cart/CartSummaryCard';
import CommonButton from '../../components/common/CommonButton';
import CommonInput from '../../components/common/CommonInput';
import { mockMenus } from '../../mocks/menus.mock';
import styles from './CheckoutPage.module.css';

const DEFAULT_SHIPPING_FEE = 3000;
const PAYMENT_METHODS = [
  '무통장입금',
  '카드결제',
  '휴대폰',
  '페이코',
  '카카오페이',
  '토스페이',
  '네이버페이',
  '삼성페이',
];

function CheckoutPage() {
  const location = useLocation();
  const orderItems = location.state?.payload?.orderItems ?? [];

  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    zipCode: '',
    address: '',
    detailAddress: '',
  });
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

  const subtotal = useMemo(
    () =>
      orderItems.reduce((sum, item) => {
        const menu = mockMenus[String(item.menuId)];
        if (!menu) {
          return sum;
        }

        const quantity = Math.max(1, Number(item.quantity) || 1);
        return sum + Number(menu.price ?? 0) * quantity;
      }, 0),
    [orderItems],
  );

  const shippingFee = subtotal > 0 ? DEFAULT_SHIPPING_FEE : 0;
  const couponDiscount = 0;
  const total = subtotal - couponDiscount + shippingFee;

  const handleInputChange = (key) => (event) => {
    setFormValues((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleCheckout = () => {};

  return (
    <section className={styles.page}>
      <h1 className={styles.pageTitle}>결제하기</h1>

      <div className={styles.layout}>
        <div className={styles.formPanel}>
          <h2 className={styles.sectionTitle}>주문자 정보</h2>
          <div className={styles.fieldList}>
            <CommonInput
              id="checkout-name"
              label="이름"
              placeholder="DB에 있는 사용자 이름"
              value={formValues.name}
              onChange={handleInputChange('name')}
            />

            <CommonInput
              id="checkout-phone"
              label="전화번호"
              required
              placeholder="DB에 있는 사용자 전화번호"
              value={formValues.phone}
              onChange={handleInputChange('phone')}
            />

            <div className={styles.addressRow}>
              <CommonInput
                id="checkout-zipcode"
                label="주소"
                required
                placeholder="우편번호"
                value={formValues.zipCode}
                onChange={handleInputChange('zipCode')}
              />
              <CommonButton
                variant="secondary"
                className={styles.searchAddressButton}
              >
                우편번호 검색
              </CommonButton>
            </div>

            <CommonInput
              id="checkout-address"
              placeholder="주소"
              value={formValues.address}
              onChange={handleInputChange('address')}
            />

            <CommonInput
              id="checkout-detail-address"
              placeholder="상세정보 입력"
              value={formValues.detailAddress}
              onChange={handleInputChange('detailAddress')}
            />
          </div>

          <section className={styles.paymentSection}>
            <h2 className={styles.sectionTitle}>결제하기</h2>
            <div className={styles.paymentGrid}>
              {PAYMENT_METHODS.map((method) => (
                <CommonButton
                  key={method}
                  variant="secondary"
                  className={`${styles.paymentButton} ${paymentMethod === method ? styles.paymentButtonActive : ''}`.trim()}
                  onClick={() => setPaymentMethod(method)}
                >
                  {method}
                </CommonButton>
              ))}
            </div>
          </section>
        </div>

        <CartSummaryCard
          className={styles.checkoutSummary}
          selectedItemCount={orderItems.length}
          subtotal={subtotal}
          discountAmount={couponDiscount}
          shippingFee={shippingFee}
          total={total}
          title="결제 금액"
          showSelectionLabel={false}
          totalLabel="총 결제 금액"
          checkoutLabel="결제하기"
          onCheckout={handleCheckout}
          showContinueButton={false}
          sticky={false}
          checkoutButtonFullWidth={false}
          checkoutButtonClassName={styles.payButton}
          disableCheckout={subtotal === 0}
        />
      </div>
    </section>
  );
}

export default CheckoutPage;
