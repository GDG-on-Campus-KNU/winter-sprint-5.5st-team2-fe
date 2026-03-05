const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

const normalizeBaseUrl = (url) => url.replace(/\/$/, '');
const normalizePath = (path) => (path.startsWith('/') ? path : `/${path}`);

const buildQueryString = (query = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
      return;
    }

    searchParams.append(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

const parseJsonSafely = async (response) => {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};

export class ApiError extends Error {
  constructor(message, { status, code, details, payload } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.payload = payload;
  }
}

export const getApiBaseUrl = () => normalizeBaseUrl(API_BASE_URL);
export const shouldUseMock = import.meta.env.VITE_USE_MOCK === 'true';

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setTokens = ({ accessToken, refreshToken } = {}) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export async function apiRequest(
  path,
  { method = 'GET', query, body, headers, signal, auth = false } = {},
) {
  const url = `${getApiBaseUrl()}${normalizePath(path)}${buildQueryString(query)}`;

  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined && !requestHeaders['Content-Type']) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (auth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    signal,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const payload = await parseJsonSafely(response);

  if (!response.ok || payload?.success === false) {
    const status = response.status;
    const code = payload?.error?.code;
    const details = payload?.error?.details;
    const message =
      payload?.error?.message ??
      `API 요청 실패 (${method.toUpperCase()} ${normalizePath(path)}): ${status}`;

    throw new ApiError(message, { status, code, details, payload });
  }

  if (payload && Object.prototype.hasOwnProperty.call(payload, 'data')) {
    return payload.data;
  }

  return payload;
}
