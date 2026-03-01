import { apiRequest } from './client';

export async function createOrder(payload) {
  return apiRequest('/api/orders', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}

export async function getOrder(orderId, signal) {
  return apiRequest(`/api/orders/${orderId}`, {
    method: 'GET',
    signal,
    auth: true,
  });
}

export async function getMyOrders(signal) {
  return apiRequest('/api/orders', {
    method: 'GET',
    signal,
    auth: true,
  });
}

export async function cancelOrder(orderId) {
  return apiRequest(`/api/orders/${orderId}/cancel`, {
    method: 'POST',
    auth: true,
  });
}

export async function confirmPayment(payload) {
  return apiRequest('/api/payments/confirm', {
    method: 'POST',
    body: payload,
    auth: true,
  });
}
