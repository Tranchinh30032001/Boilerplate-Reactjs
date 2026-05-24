/**
 * API Client — single source for ALL HTTP requests.
 * Built on axios. AI: Mọi API call PHẢI đi qua file này.
 * Không dùng axios hoặc fetch trực tiếp trong features.
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosError } from 'axios'
import type { ApiError } from '@/types'

// ─── Instance ────────────────────────────────────────────────────────────────

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor — attach auth token ─────────────────────────────────

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response Interceptor — normalize errors ─────────────────────────────────

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }

    // Normalize về ApiError format để features không cần xử lý axios error trực tiếp
    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      code: error.response?.data?.code ?? 'UNKNOWN_ERROR',
      status: error.response?.status ?? 0,
      details: error.response?.data?.details,
    }

    return Promise.reject(apiError)
  },
)

// ─── Typed Helpers ────────────────────────────────────────────────────────────

type RequestConfig = Omit<AxiosRequestConfig, 'url' | 'method'>

export const apiClient = {
  get: <T>(url: string, config?: RequestConfig) =>
    instance.get<T>(url, config).then((r) => r.data),

  post: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    instance.post<T>(url, data, config).then((r) => r.data),

  patch: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    instance.patch<T>(url, data, config).then((r) => r.data),

  put: <T>(url: string, data?: unknown, config?: RequestConfig) =>
    instance.put<T>(url, data, config).then((r) => r.data),

  delete: <T = void>(url: string, config?: RequestConfig) =>
    instance.delete<T>(url, config).then((r) => r.data),
}

// Export instance nếu cần access raw axios (upload, cancel token...)
export { instance as axiosInstance }
