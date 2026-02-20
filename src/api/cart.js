import { getApiBaseUrl } from './client';

export async function addToCart(payload) {
  const requestUrl = `${getApiBaseUrl()}/api/cart`;
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`장바구니 추가 실패: ${response.status}`);
  }

  const result = await response.json();
  return result?.data ?? result;
}
