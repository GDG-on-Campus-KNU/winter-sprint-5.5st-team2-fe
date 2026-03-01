import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const getProductId = (product) =>
  String(product?.productId ?? product?.id ?? product?.menuId ?? '');

const getCartItemId = (product, fallbackCartItemId) => {
  const value = fallbackCartItemId ?? product?.cartItemId;

  if (value === undefined || value === null || value === '') {
    return null;
  }

  return String(value);
};

const normalizeCartItem = (product, quantity = 1, selectedSize, cartItemId) => {
  const productId = getProductId(product);
  const sizeOptions =
    Array.isArray(product?.sizeOptions) && product.sizeOptions.length > 0
      ? product.sizeOptions
      : Array.isArray(product?.sizes) && product.sizes.length > 0
        ? product.sizes
        : ['FREE'];

  const normalizedSelectedSize =
    selectedSize ?? product?.selectedSize ?? sizeOptions[0];
  const price = Number(product?.price ?? product?.originalPrice ?? 0);
  const originalPrice = Number(product?.originalPrice ?? price);

  return {
    cartItemId: getCartItemId(product, cartItemId),
    productId,
    brand: product?.brand ?? '브랜드',
    name: product?.name ?? '상품명',
    imageUrl: product?.imageUrl ?? product?.image ?? '',
    price,
    originalPrice,
    discountRate: Number(product?.discountRate ?? 0),
    sizeOptions,
    selectedSize: normalizedSelectedSize,
    quantity: Math.max(1, Number(quantity) || 1),
  };
};

const makeLocalCartItemId = (sequence) => `local-${sequence}`;

const migrateCartItems = (items = []) =>
  items.map((item, index) => {
    const productId = String(item?.productId ?? item?.id ?? item?.menuId ?? '');
    const fallbackSize =
      item?.selectedSize ??
      (Array.isArray(item?.sizeOptions) && item.sizeOptions.length > 0
        ? item.sizeOptions[0]
        : 'FREE');

    return {
      ...item,
      cartItemId: String(item?.cartItemId ?? `legacy-${index + 1}`),
      productId,
      selectedSize: fallbackSize,
      sizeOptions:
        Array.isArray(item?.sizeOptions) && item.sizeOptions.length > 0
          ? item.sizeOptions
          : ['FREE'],
      quantity: Math.max(1, Number(item?.quantity) || 1),
    };
  });

const useCartStore = create(
  persist(
    (set) => ({
      cartItems: [],
      nextLocalCartItemId: 1,
      addItem: (product, quantity = 1, selectedSize, cartItemId) =>
        set((state) => {
          const nextItem = normalizeCartItem(
            product,
            quantity,
            selectedSize,
            cartItemId,
          );

          if (!nextItem.productId) {
            return state;
          }

          const existingIndex = state.cartItems.findIndex(
            (item) =>
              item.productId === nextItem.productId &&
              item.selectedSize === nextItem.selectedSize,
          );

          if (existingIndex !== -1) {
            const updatedItems = [...state.cartItems];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity:
                updatedItems[existingIndex].quantity + nextItem.quantity,
              cartItemId:
                nextItem.cartItemId ?? updatedItems[existingIndex].cartItemId,
            };

            return { cartItems: updatedItems };
          }

          const resolvedCartItemId =
            nextItem.cartItemId ??
            makeLocalCartItemId(state.nextLocalCartItemId);

          return {
            cartItems: [
              ...state.cartItems,
              { ...nextItem, cartItemId: resolvedCartItemId },
            ],
            nextLocalCartItemId: nextItem.cartItemId
              ? state.nextLocalCartItemId
              : state.nextLocalCartItemId + 1,
          };
        }),
      removeItem: (targetCartItemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => item.cartItemId !== String(targetCartItemId),
          ),
        })),
      updateItemQuantity: (targetCartItemId, delta) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) =>
            item.cartItemId === String(targetCartItemId)
              ? { ...item, quantity: Math.max(1, item.quantity + delta) }
              : item,
          ),
        })),
      updateItemSize: (targetCartItemId, selectedSize) =>
        set((state) => {
          const normalizedCartItemId = String(targetCartItemId);
          const targetItem = state.cartItems.find(
            (item) => item.cartItemId === normalizedCartItemId,
          );

          if (!targetItem || targetItem.selectedSize === selectedSize) {
            return state;
          }

          const duplicateItem = state.cartItems.find(
            (item) =>
              item.cartItemId !== normalizedCartItemId &&
              item.productId === targetItem.productId &&
              item.selectedSize === selectedSize,
          );

          if (!duplicateItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.cartItemId === normalizedCartItemId
                  ? { ...item, selectedSize }
                  : item,
              ),
            };
          }

          return {
            cartItems: state.cartItems
              .filter((item) => item.cartItemId !== normalizedCartItemId)
              .map((item) =>
                item.cartItemId === duplicateItem.cartItemId
                  ? { ...item, quantity: item.quantity + targetItem.quantity }
                  : item,
              ),
          };
        }),
      clearCart: () => set({ cartItems: [], nextLocalCartItemId: 1 }),
    }),
    {
      name: 'cart-storage',
      version: 2,
      migrate: (persistedState, version) => {
        if (!persistedState || typeof persistedState !== 'object') {
          return { cartItems: [], nextLocalCartItemId: 1 };
        }

        if (version >= 2) {
          return persistedState;
        }

        const migratedItems = migrateCartItems(persistedState.cartItems);

        return {
          ...persistedState,
          cartItems: migratedItems,
          nextLocalCartItemId:
            Number(persistedState.nextLocalCartItemId) > 0
              ? Number(persistedState.nextLocalCartItemId)
              : 1,
        };
      },
    },
  ),
);

export default useCartStore;
