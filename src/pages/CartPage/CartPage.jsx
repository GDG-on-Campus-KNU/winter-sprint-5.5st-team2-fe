import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../../components/Cart/CartItemCard';
import CartSummaryCard from '../../components/Cart/CartSummaryCard';
import CommonButton from '../../components/common/CommonButton';
import CommonCheckbox from '../../components/common/CommonCheckbox';
import useCartStore from '../../store/useCartStore';
import { MOCK_COUPON_RESPONSE } from '../../mocks/coupons.mock';
import styles from './CartPage.module.css';

import CouponModal from '../../components/common/CouponModal';

const DEFAULT_SHIPPING_FEE = 3000;

function CartPage() {
  const navigate = useNavigate();
  const cartItems = useCartStore((state) => state.cartItems);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateItemQuantity = useCartStore((state) => state.updateItemQuantity);
  const updateItemSize = useCartStore((state) => state.updateItemSize);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const hasInitializedSelection = useRef(false);

  const applyCouponToItem = useCartStore((state) => state.applyCouponToItem);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponTargetCartItemId, setCouponTargetCartItemId] = useState(null);
  const coupons = useMemo(() => MOCK_COUPON_RESPONSE.data ?? [], []);
  const couponMap = useMemo(
    () => new Map(coupons.map((coupon) => [String(coupon.id), coupon])),
    [coupons],
  );

  useEffect(() => {
    const allIds = cartItems.map((item) => item.cartItemId);

    if (!hasInitializedSelection.current) {
      setSelectedItemIds(allIds);
      hasInitializedSelection.current = true;
      return;
    }

    setSelectedItemIds((prev) => {
      if (allIds.length === 0) {
        return [];
      }

      return prev.filter((id) => allIds.includes(id));
    });
  }, [cartItems]);

  const brandGroups = useMemo(() => {
    const map = cartItems.reduce((acc, item) => {
      const grouped = acc.get(item.brand) ?? [];
      grouped.push({
        ...item,
        appliedCouponName:
          couponMap.get(String(item.appliedCouponId))?.couponName ?? '',
      });
      acc.set(item.brand, grouped);
      return acc;
    }, new Map());

    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'ko'))
      .map(([brand, items]) => ({ brand, items }));
  }, [cartItems, couponMap]);

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedItemIds.includes(item.cartItemId)),
    [cartItems, selectedItemIds],
  );
  const allItemIds = useMemo(
    () => cartItems.map((item) => item.cartItemId),
    [cartItems],
  );
  const isAllSelected =
    allItemIds.length > 0 &&
    allItemIds.every((itemId) => selectedItemIds.includes(itemId));
  const isSomeSelected = selectedItemIds.length > 0 && !isAllSelected;

  const subtotal = useMemo(
    () =>
      selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [selectedItems],
  );
  const discountAmount = useMemo(
    () =>
      selectedItems.reduce((sum, item) => {
        const appliedCoupon = couponMap.get(String(item.appliedCouponId));
        if (!appliedCoupon || appliedCoupon.isUsed) {
          return sum;
        }

        const discountType = String(
          appliedCoupon.discountType ?? '',
        ).toUpperCase();
        const itemSubtotal = item.price * item.quantity;

        if (discountType === 'PERCENT') {
          return (
            sum +
            Math.floor(
              (itemSubtotal * Number(appliedCoupon.discountValue)) / 100,
            )
          );
        }

        if (discountType === 'FIXED') {
          return (
            sum + Math.min(itemSubtotal, Number(appliedCoupon.discountValue))
          );
        }

        return sum;
      }, 0),
    [couponMap, selectedItems],
  );
  const shippingFee = selectedItems.length > 0 ? DEFAULT_SHIPPING_FEE : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleRemoveItem = (targetCartItemId) => {
    removeItem(targetCartItemId);
    setSelectedItemIds((prev) => prev.filter((id) => id !== targetCartItemId));
  };

  const handleQuantityChange = (targetCartItemId, delta) => {
    updateItemQuantity(targetCartItemId, delta);
  };

  const handleSizeChange = (targetCartItemId, selectedSize) => {
    updateItemSize(targetCartItemId, selectedSize);
  };

  const handleItemCheckedChange = (cartItemId, isChecked) => {
    if (isChecked) {
      setSelectedItemIds((prev) =>
        prev.includes(cartItemId) ? prev : [...prev, cartItemId],
      );
      return;
    }

    setSelectedItemIds((prev) => prev.filter((id) => id !== cartItemId));
  };

  const handleBrandCheckedChange = (brand, isChecked) => {
    const brandItemIds = cartItems
      .filter((item) => item.brand === brand)
      .map((item) => item.cartItemId);

    if (isChecked) {
      setSelectedItemIds((prev) => [...new Set([...prev, ...brandItemIds])]);
      return;
    }

    setSelectedItemIds((prev) =>
      prev.filter((id) => !brandItemIds.includes(id)),
    );
  };

  const handleAllCheckedChange = (isChecked) => {
    if (isChecked) {
      setSelectedItemIds(allItemIds);
      return;
    }
    setSelectedItemIds([]);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      return;
    }

    const payload = {
      orderItems: selectedItems.map((item) => ({
        productId: Number(item.productId),
        menuId: Number(item.productId),
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        unitPrice: Number(item.price ?? 0),
        appliedCouponId: item.appliedCouponId,
      })),
      couponId: null,
    };

    navigate('/checkout', { state: { payload } });
  };

  const openCouponModalForItem = (cartItemId) => {
    setCouponTargetCartItemId(cartItemId);
    setIsCouponModalOpen(true);
  };

  const closeCouponModal = () => {
    setIsCouponModalOpen(false);
    setCouponTargetCartItemId(null);
  };

  const handleSelectCoupon = (coupon) => {
    if (!couponTargetCartItemId) return;
    if (coupon.isUsed) return;
    applyCouponToItem(couponTargetCartItemId, coupon.id);
    closeCouponModal();
  };

  const selectedCouponIdForModal = useMemo(() => {
    if (!couponTargetCartItemId) {
      return null;
    }

    const targetItem = cartItems.find(
      (item) => String(item.cartItemId) === String(couponTargetCartItemId),
    );

    return targetItem?.appliedCouponId
      ? String(targetItem.appliedCouponId)
      : null;
  }, [cartItems, couponTargetCartItemId]);

  if (cartItems.length === 0) {
    return (
      <section className={styles.page}>
        <div className={styles.emptyState}>
          <h1 className={styles.title}>장바구니</h1>
          <p className={styles.emptyMessage}>
            장바구니에 담긴 상품이 없습니다.
          </p>
          <CommonButton onClick={() => navigate('/')}>
            쇼핑 계속하기
          </CommonButton>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.page}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>장바구니</h1>
        <p className={styles.countLabel}>총 {cartItems.length}개 상품</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.cardList}>
          <div className={styles.selectControl}>
            <CommonCheckbox
              id="cart-select-all"
              checked={isAllSelected}
              indeterminate={isSomeSelected}
              onChange={handleAllCheckedChange}
              label="전체선택"
            />
          </div>

          {brandGroups.map((group) => (
            <CartItemCard
              key={group.brand}
              brand={group.brand}
              items={group.items}
              selectedItemIds={selectedItemIds}
              isBrandChecked={group.items.every((item) =>
                selectedItemIds.includes(item.cartItemId),
              )}
              isBrandIndeterminate={
                group.items.some((item) =>
                  selectedItemIds.includes(item.cartItemId),
                ) &&
                !group.items.every((item) =>
                  selectedItemIds.includes(item.cartItemId),
                )
              }
              onBrandCheckedChange={handleBrandCheckedChange}
              onItemCheckedChange={handleItemCheckedChange}
              onSizeChange={handleSizeChange}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
              onOpenCouponModal={openCouponModalForItem}
            />
          ))}
        </div>

        <CartSummaryCard
          selectedItemCount={selectedItems.length}
          subtotal={subtotal}
          discountAmount={discountAmount}
          shippingFee={shippingFee}
          total={total}
          onCheckout={handleCheckout}
          onContinueShopping={() => navigate('/')}
        />
      </div>

      <CouponModal
        open={isCouponModalOpen}
        onClose={closeCouponModal}
        coupons={coupons}
        selectedCouponId={selectedCouponIdForModal}
        onSelectCoupon={handleSelectCoupon}
      />
    </section>
  );
}

export default CartPage;
