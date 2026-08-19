import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number };
}

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post<ApiResponse<{ accessToken: string }>>(
      `${API_URL}/auth/refresh`,
      {},
      { withCredentials: true }
    );
    return response.data.data.accessToken;
  } catch {
    return null;
  }
};

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      if (isRefreshing) {
        try {
          await new Promise((resolve, reject) =>
            failedQueue.push({ resolve, reject })
          );
          return api(original);
        } catch (queueError) {
          return Promise.reject(queueError);
        }
      }

      original._retry = true;
      isRefreshing = true;

      const token = await refreshAccessToken();
      processQueue(null, token);
      isRefreshing = false;

      if (token) {
        return api(original);
      }

      const currentPath = window.location.pathname;
      if (!currentPath.startsWith('/login') && !currentPath.startsWith('/register')) {
        window.location.assign(new URL('/login', window.location.origin).toString());
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.get<ApiResponse<T>>(url, config).then((res) => res.data),
  post: <T = unknown>(url: string, data?: unknown) =>
    api.post<ApiResponse<T>>(url, data).then((res) => res.data),
  patch: <T = unknown>(url: string, data?: unknown) =>
    api.patch<ApiResponse<T>>(url, data).then((res) => res.data),
  delete: <T = unknown>(url: string) =>
    api.delete<ApiResponse<T>>(url).then((res) => res.data),
};

export type { ApiResponse };
