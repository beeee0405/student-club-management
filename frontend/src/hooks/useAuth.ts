import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../lib/api/auth';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'current'],
    queryFn: authApi.getCurrentUser,
    retry: false,
    enabled: !!localStorage.getItem('token'), // Chỉ gọi API khi có token
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: authApi.login,
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      authApi.logout();
      return Promise.resolve();
    },
    onSuccess: () => {
      // Clear all cached user data to reflect logged-out state immediately
      queryClient.clear();
    },
  });
}