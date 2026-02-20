const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

const normalizeBaseUrl = (url) => url.replace(/\/$/, '');

export const getApiBaseUrl = () => normalizeBaseUrl(API_BASE_URL);

export const shouldUseMock =
  import.meta.env.VITE_USE_MOCK === 'true' || getApiBaseUrl().length === 0;
