import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { clubApi } from '../lib/api/clubs';
import type { Club, Member } from '../lib/types';

export function useClubs({ page = 1, limit = 10, search = '' } = {}) {
  return useQuery<{ clubs: Club[]; total: number }>({
    queryKey: ['clubs', { page, limit, search }],
    queryFn: () => clubApi.getClubs({ page, limit, search }),
    placeholderData: keepPreviousData,
  });
}

export function useClub(id: number) {
  return useQuery({
    queryKey: ['club', id],
    queryFn: () => clubApi.getClub(id),
    enabled: !!id,
  });
}

export function useCreateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubApi.createClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
  });
}

export function useUpdateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      clubApi.updateClub(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club', id] });
    },
  });
}

export function useDeleteClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clubApi.deleteClub,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
    },
  });
}

export function useClubMembers(clubId: number) {
  return useQuery<Member[]>({
    queryKey: ['club', clubId, 'members'],
    queryFn: () => clubApi.getClubMembers(clubId),
    enabled: !!clubId,
  });
}

export function useAddClubMember(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role?: string }) =>
      clubApi.addClubMember(clubId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', clubId, 'members'] });
    },
  });
}

export function useRemoveClubMember(clubId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => clubApi.removeClubMember(clubId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', clubId, 'members'] });
    },
  });
}