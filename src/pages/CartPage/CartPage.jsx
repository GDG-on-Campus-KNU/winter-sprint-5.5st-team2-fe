import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CartItemCard from '../../components/Cart/CartItemCard';
import CartSummaryCard from '../../components/Cart/CartSummaryCard';
import CommonButton from '../../components/common/CommonButton';
import CommonCheckbox from '../../components/common/CommonCheckbox';
import { mockMenuList, mockMenus } from '../../mocks/menus.mock';
import styles from './CartPage.module.css';

const DEFAULT_SHIPPING_FEE = 3000;

function toCartItem(menu, quantity = 1) {
  const options = menu.sizes?.length ? menu.sizes : ['FREE'];
  return {
    id: String(menu.id),
    brand: menu.brand,
    name: menu.name,
    imageUrl: menu.imageUrl,
    price: Number(menu.price ?? menu.originalPrice ?? 0),
    originalPrice: Number(menu.originalPrice ?? menu.price ?? 0),
    sizeOptions: options,
    selectedSize: options[0],
    quantity: Math.max(1, Number(quantity) || 1),
  };
}

function getInitialItems(payload) {
  if (Array.isArray(payload?.items) && payload.items.length > 0) {
    return payload.items
      .map((item) => {
        const menu = mockMenus[String(item.menuId)];
        return menu ? toCartItem(menu, item.quantity) : null;
      })
      .filter(Boolean);
  }

  if (payload?.menuId) {
    const menu = mockMenus[String(payload.menuId)];
    if (menu) {
      return [toCartItem(menu, payload.quantity)];
    }
  }

  return [toCartItem(mockMenuList[0], 1)];
}

function CartPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(() =>
    getInitialItems(location.state?.payload),
  );
  const [selectedItemIds, setSelectedItemIds] = useState(() => {
    const items = getInitialItems(location.state?.payload);
    return items.map((item) => item.id);
  });

  const brandGroups = useMemo(() => {
    const map = cartItems.reduce((acc, item) => {
      const grouped = acc.get(item.brand) ?? [];
      grouped.push(item);
      acc.set(item.brand, grouped);
      return acc;
    }, new Map());

    return [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b, 'ko'))
      .map(([brand, items]) => ({ brand, items }));
  }, [cartItems]);

  const selectedItems = useMemo(
    () => cartItems.filter((item) => selectedItemIds.includes(item.id)),
    [cartItems, selectedItemIds],
  );
  const allItemIds = useMemo(
    () => cartItems.map((item) => item.id),
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
  const shippingFee = selectedItems.length > 0 ? DEFAULT_SHIPPING_FEE : 0;
  const total = subtotal + shippingFee;

  const handleRemoveItem = (targetId) => {
    const nextItems = cartItems.filter((item) => item.id !== targetId);
    setCartItems(nextItems);
    setSelectedItemIds((prev) => prev.filter((id) => id !== targetId));
  };

  const handleQuantityChange = (targetId, delta) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== targetId) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(1, item.quantity + delta),
        };
      }),
    );
  };

  const handleSizeChange = (targetId, selectedSize) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === targetId ? { ...item, selectedSize } : item,
      ),
    );
  };

  const handleItemCheckedChange = (itemId, isChecked) => {
    if (isChecked) {
      setSelectedItemIds((prev) =>
        prev.includes(itemId) ? prev : [...prev, itemId],
      );
      return;
    }

    setSelectedItemIds((prev) => prev.filter((id) => id !== itemId));
  };

  const handleBrandCheckedChange = (brand, isChecked) => {
    const brandItemIds = cartItems
      .filter((item) => item.brand === brand)
      .map((item) => item.id);

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
        menuId: Number(item.id),
        quantity: item.quantity,
      })),
      couponId: null,
    };

    navigate('/checkout', { state: { payload } });
  };

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
                selectedItemIds.includes(item.id),
              )}
              isBrandIndeterminate={
                group.items.some((item) => selectedItemIds.includes(item.id)) &&
                !group.items.every((item) => selectedItemIds.includes(item.id))
              }
              onBrandCheckedChange={handleBrandCheckedChange}
              onItemCheckedChange={handleItemCheckedChange}
              onSizeChange={handleSizeChange}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
            />
          ))}
        </div>

        <CartSummaryCard
          selectedItemCount={selectedItems.length}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
          onCheckout={handleCheckout}
          onContinueShopping={() => navigate('/')}
        />
      </div>
    </section>
  );
}

export default CartPage;
