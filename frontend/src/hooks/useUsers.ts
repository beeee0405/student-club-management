import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { userApi } from '../lib/api/users';
import type { User } from '../lib/types';
import type { CreateUserInput, UpdateUserInput } from '../lib/api/users';

export function useUsers({ page = 1, limit = 10, search = '' } = {}) {
  return useQuery<{ users: User[]; total: number}>({
    queryKey: ['users', { page, limit, search }],
    queryFn: () => userApi.getUsers({ page, limit, search }),
    placeholderData: keepPreviousData,
  });
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userApi.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => userApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserInput }) =>
      userApi.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}