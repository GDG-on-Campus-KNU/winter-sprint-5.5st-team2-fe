import { apiRequest } from './client';

export async function getMyCoupons(signal) {
  return apiRequest('/api/coupons/me', {
    method: 'GET',
    signal,
    auth: true,
  });
}

export async function applyCoupon(couponId, payload) {
  return apiRequest(`/api/coupons/${couponId}/apply`, {
    method: 'POST',
    body: payload,
    auth: true,
  });
}
