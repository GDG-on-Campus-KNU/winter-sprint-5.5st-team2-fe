import { getApiBaseUrl } from './client';

export async function getMenuDetail(id, signal) {
  const requestUrl = `${getApiBaseUrl()}/api/menus/${id}`;
  const response = await fetch(requestUrl, {
    method: 'GET',
    signal,
  });

  if (!response.ok) {
    throw new Error(`상품 조회 실패: ${response.status}`);
  }

  const result = await response.json();
  return result?.data ?? result;
}
