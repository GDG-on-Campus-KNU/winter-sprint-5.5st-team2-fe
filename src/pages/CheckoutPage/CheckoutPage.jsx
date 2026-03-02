import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getMyProfile } from '../../api/auth';
import { shouldUseMock } from '../../api/client';
import { createOrder, getOrder } from '../../api/orders';
import CartSummaryCard from '../../components/Cart/CartSummaryCard';
import CommonButton from '../../components/common/CommonButton';
import CommonInput from '../../components/common/CommonInput';
import { useToast } from '../../context/ToastContext';
import { mockMenus } from '../../mocks/menus.mock';
import useAuthStore from '../../store/useAuthStore';
import styles from './CheckoutPage.module.css';

const DEFAULT_SHIPPING_FEE = 3000;
const DEFAULT_SHIPPING_ADDRESS = '서울특별시 강남구 테헤란로 123';
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
const DAUM_POSTCODE_SCRIPT_URL =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

function CheckoutPage() {
  const location = useLocation();
  const showToast = useToast();
  const user = useAuthStore((state) => state.user);
  const setAuth = useAuthStore((state) => state.setAuth);
  const orderItems = location.state?.payload?.orderItems ?? [];
  const [currentOrderId, setCurrentOrderId] = useState(
    location.state?.orderId ?? null,
  );
  const [orderDetail, setOrderDetail] = useState(null);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPostcodeReady, setIsPostcodeReady] = useState(false);

  const [formValues, setFormValues] = useState({
    name: '',
    phone: '',
    zipCode: '',
    address: '',
    detailAddress: '',
  });
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);

  useEffect(() => {
    if (window.daum?.Postcode) {
      setIsPostcodeReady(true);
      return;
    }

    const existingScript = document.querySelector(
      `script[src="${DAUM_POSTCODE_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      const handleReady = () => setIsPostcodeReady(true);
      existingScript.addEventListener('load', handleReady);
      return () => existingScript.removeEventListener('load', handleReady);
    }

    const script = document.createElement('script');
    script.src = DAUM_POSTCODE_SCRIPT_URL;
    script.async = true;

    const handleLoad = () => setIsPostcodeReady(true);
    script.addEventListener('load', handleLoad);
    document.body.appendChild(script);

    return () => script.removeEventListener('load', handleLoad);
  }, []);

  useEffect(() => {
    if (shouldUseMock) {
      return;
    }

    const controller = new AbortController();

    const fetchMyProfile = async () => {
      try {
        const profile = await getMyProfile(controller.signal);
        if (profile) {
          setAuth(profile);
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          // Ignore profile fetch failure and keep current form values.
        }
      }
    };

    fetchMyProfile();

    return () => controller.abort();
  }, [setAuth]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      name: prev.name || user.name || user.userName || '',
      phone: prev.phone || user.phone || '',
      zipCode: prev.zipCode || user.zipCode || user.postCode || '',
      address: prev.address || user.address || '',
      detailAddress: prev.detailAddress || user.detailAddress || '',
    }));
  }, [user]);

  useEffect(() => {
    if (!currentOrderId) {
      setOrderDetail(null);
      return;
    }

    const controller = new AbortController();

    const fetchOrder = async () => {
      try {
        setIsOrderLoading(true);
        setOrderError('');
        const data = await getOrder(currentOrderId, controller.signal);
        setOrderDetail(data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setOrderError('주문 정보를 불러오지 못했습니다.');
          showToast('주문 정보를 불러오지 못했습니다.', 'error');
        }
      } finally {
        setIsOrderLoading(false);
      }
    };

    fetchOrder();

    return () => controller.abort();
  }, [currentOrderId, showToast]);

  const calculatedSubtotal = useMemo(
    () =>
      orderItems.reduce((sum, item) => {
        const quantity = Math.max(1, Number(item.quantity) || 1);
        const unitPrice = Number(item.unitPrice);

        if (Number.isFinite(unitPrice) && unitPrice > 0) {
          return sum + unitPrice * quantity;
        }

        const menu = mockMenus[String(item.menuId ?? item.productId)];
        if (!menu) {
          return sum;
        }

        return sum + Number(menu.price ?? 0) * quantity;
      }, 0),
    [orderItems],
  );

  const subtotal = orderDetail?.totalPrice
    ? Number(orderDetail.totalPrice)
    : calculatedSubtotal;
  const shippingFee = orderDetail?.totalPrice
    ? 0
    : subtotal > 0
      ? DEFAULT_SHIPPING_FEE
      : 0;
  const couponDiscount = 0;
  const total = subtotal - couponDiscount + shippingFee;

  const handleInputChange = (key) => (event) => {
    setFormValues((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSearchAddress = () => {
    if (!window.daum?.Postcode || !isPostcodeReady) {
      showToast(
        '주소 검색 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.',
        'error',
      );
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        const roadAddress = data.roadAddress || data.jibunAddress || '';
        const extras = [];

        if (data.bname && /(동|로|가)$/.test(data.bname)) {
          extras.push(data.bname);
        }

        if (data.buildingName && data.apartment === 'Y') {
          extras.push(data.buildingName);
        }

        const extraAddress = extras.length > 0 ? ` (${extras.join(', ')})` : '';

        setFormValues((prev) => ({
          ...prev,
          zipCode: data.zonecode || '',
          address: `${roadAddress}${extraAddress}`.trim(),
        }));
      },
    }).open();
  };

  const handleCheckout = async () => {
    if (isSubmitting) {
      return;
    }

    const normalizedOrderItems = orderItems
      .map((item) => ({
        productId: Number(item.productId ?? item.menuId),
        quantity: Math.max(1, Number(item.quantity) || 1),
        selectedSize: item.selectedSize,
        unitPrice: Number(item.unitPrice ?? 0),
        appliedCouponId: item.appliedCouponId
          ? Number(item.appliedCouponId)
          : null,
      }))
      .filter((item) => Number.isFinite(item.productId) && item.productId > 0);

    if (normalizedOrderItems.length === 0) {
      showToast('주문할 상품 정보가 없습니다.', 'error');
      return;
    }

    const shippingAddress =
      `${formValues.address} ${formValues.detailAddress}`.trim() ||
      DEFAULT_SHIPPING_ADDRESS;

    try {
      setIsSubmitting(true);
      const createdOrder = await createOrder({
        orderItems: normalizedOrderItems,
        shippingAddress,
        couponId: null,
      });

      const resolvedOrderId =
        createdOrder?.orderId ?? createdOrder?.id ?? createdOrder?.order_id;

      if (!resolvedOrderId) {
        throw new Error('orderId missing');
      }

      setCurrentOrderId(String(resolvedOrderId));
      showToast('주문이 완료되었습니다.', 'success');
    } catch {
      setOrderError('결제 처리에 실패했습니다.');
      showToast('결제 처리에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page}>
      <h1 className={styles.pageTitle}>결제하기</h1>

      <div className={styles.layout}>
        <div className={styles.formPanel}>
          {currentOrderId ? (
            <section className={styles.paymentSection}>
              <h2 className={styles.sectionTitle}>주문 정보</h2>
              {isOrderLoading ? <p>주문 정보를 불러오는 중입니다...</p> : null}
              {!isOrderLoading && orderError ? <p>{orderError}</p> : null}
              {!isOrderLoading && !orderError && orderDetail ? (
                <div className={styles.fieldList}>
                  <p>주문번호: {orderDetail.orderId}</p>
                  <p>주문상태: {orderDetail.orderStatus}</p>
                  <p>결제상태: {orderDetail.paymentStatus}</p>
                  <p>
                    주문일시:{' '}
                    {orderDetail.createdAt
                      ? new Date(orderDetail.createdAt).toLocaleString('ko-KR')
                      : '-'}
                  </p>
                </div>
              ) : null}
            </section>
          ) : null}

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
                onClick={handleSearchAddress}
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
          checkoutLabel={isSubmitting ? '결제 처리중...' : '결제하기'}
          onCheckout={handleCheckout}
          showContinueButton={false}
          sticky={false}
          checkoutButtonFullWidth={false}
          checkoutButtonClassName={styles.payButton}
          disableCheckout={subtotal === 0 || isSubmitting}
        />
      </div>
    </section>
  );
}

export default CheckoutPage;
