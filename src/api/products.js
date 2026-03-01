import { apiRequest } from './client';

export async function getProducts(query, signal) {
  return apiRequest('/api/products', {
    method: 'GET',
    query,
    signal,
  });
}

export async function getProductDetail(id, signal) {
  return apiRequest(`/api/products/${id}`, {
    method: 'GET',
    signal,
  });
}

export async function searchProducts(query, signal) {
  return apiRequest('/api/products/search', {
    method: 'GET',
    query,
    signal,
  });
}
