import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, type LoginCredentials } from '@/services/auth/authApi'

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    retry: false,
    staleTime: Infinity,
  })

export const useLogin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.accessToken)
      queryClient.setQueryData(['auth', 'me'], data.user)
    },
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      localStorage.removeItem('access_token')
      queryClient.clear()
      window.location.href = '/login'
    },
  })
}
