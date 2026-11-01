/**
 * Axios API client singleton.
 * Configured with base URL, credentials (HttpOnly cookies), and interceptors.
 * Handles 401 refresh flow, 403 redirect, and error normalization.
 * @see LLD Section 7.4, Section 9
 */
import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '../types/api.types';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  withCredentials: true, // Required for HttpOnly cookie auth (A-02)
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: unknown, token: unknown = null): void {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

// Request interceptor: add X-Trace-Id header
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const traceId = crypto.randomUUID();
    config.headers['X-Trace-Id'] = traceId;
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: handle 401 refresh, 403 redirect, normalize errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => apiClient(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post('/api/v1/auth/refresh');
        processQueue(null, null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clear auth state and redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 403) {
      window.location.href = '/forbidden';
    }

    // Normalize error to ApiError shape
    const normalizedError: ApiError = (error.response?.data as ApiError) ?? {
      timestamp: new Date().toISOString(),
      status: error.response?.status ?? 0,
      errorCode: 'INTERNAL_ERROR',
      message: error.message ?? 'An unexpected error occurred.',
      path: originalRequest?.url ?? '',
      traceId: '',
      fieldErrors: [],
    };

    return Promise.reject(normalizedError);
  },
);

export default apiClient;
