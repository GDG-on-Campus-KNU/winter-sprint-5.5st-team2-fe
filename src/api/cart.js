import { apiRequest } from './client';

const toCartPayload = (payload = {}) => {
  if (payload.productId) {
    return payload;
  }

  if (payload.menuId) {
    const { menuId, ...rest } = payload;
    return {
      ...rest,
      productId: menuId,
    };
  }

  return payload;
};

export async function getCart(signal) {
  return apiRequest('/api/cart', {
    method: 'GET',
    signal,
    auth: true,
  });
}

export async function addToCart(payload) {
  return apiRequest('/api/cart', {
    method: 'POST',
    body: toCartPayload(payload),
    auth: true,
  });
}

export async function updateCartItem(cartItemId, payload) {
  return apiRequest(`/api/cart/${cartItemId}`, {
    method: 'PATCH',
    body: payload,
    auth: true,
  });
}

export async function deleteCartItem(cartItemId) {
  return apiRequest(`/api/cart/${cartItemId}`, {
    method: 'DELETE',
    auth: true,
  });
}

export async function deleteCartItems(cartItemIds = []) {
  return apiRequest('/api/cart', {
    method: 'DELETE',
    body: { cartItemIds },
    auth: true,
  });
}
