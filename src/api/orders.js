import { getApiBaseUrl } from './client';

export async function createOrder(payload) {
  const requestUrl = `${getApiBaseUrl()}/api/orders`;
  const response = await fetch(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`주문 생성 실패: ${response.status}`);
  }

  const result = await response.json();
  return result?.data ?? result;
}
