interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const BASE_URL = 'http://localhost:8080';

export async function request<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(data.message || '请求失败');
  }

  return data;
}

export const api = {
  // 认证相关
  auth: {
    login: (username: string, password: string) =>
      request<{ token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),

    register: (data: {
      username: string;
      password: string;
      nickname: string;
      email: string;
    }) =>
      request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    logout: () =>
      request('/api/auth/logout', {
        method: 'POST',
      }),

    getCurrentUser: () =>
      request<{
        id: number;
        username: string;
        nickname: string;
        email: string;
        avatar: string;
      }>('/api/auth/current-user'),
  },
}; 