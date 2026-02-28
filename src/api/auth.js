import {
  apiRequest,
  clearTokens,
  getRefreshToken,
  setTokens,
} from './client';

export async function signupUser(payload) {
  return apiRequest('/api/auth/signup/user', {
    method: 'POST',
    body: payload,
  });
}

export async function signupAdmin(payload) {
  return apiRequest('/api/auth/signup/admin', {
    method: 'POST',
    body: payload,
  });
}

export async function login(payload) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: payload,
  });

  setTokens({
    accessToken: data?.accessToken,
    refreshToken: data?.refreshToken,
  });

  return data;
}

export async function refreshAccessToken(
  refreshToken = getRefreshToken(),
) {
  const data = await apiRequest('/api/auth/refresh', {
    method: 'POST',
    body: { refreshToken },
  });

  setTokens({ accessToken: data?.accessToken });
  return data;
}

export async function logout() {
  try {
    return await apiRequest('/api/auth/logout', {
      method: 'POST',
      auth: true,
    });
  } finally {
    clearTokens();
  }
}

export async function getMyProfile(signal) {
  return apiRequest('/api/users/me', {
    method: 'GET',
    signal,
    auth: true,
  });
}

export async function checkEmail(email, signal) {
  return apiRequest('/api/auth/check-email', {
    method: 'GET',
    query: { email },
    signal,
  });
}
