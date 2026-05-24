import { apiClient } from '@/services/apiClient'

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: { id: string; email: string; name: string }
  accessToken: string
}

export const authApi = {
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>('/auth/login', credentials),

  logout: () =>
    apiClient.post<void>('/auth/logout'),

  getMe: () =>
    apiClient.get<LoginResponse['user']>('/auth/me'),
}
