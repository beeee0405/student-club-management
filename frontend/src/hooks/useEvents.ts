import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { eventApi } from '../lib/api/events';
import type { Event } from '../lib/types';

export function useEvents(
  params: {
    page?: number;
    limit?: number;
    search?: string;
    clubId?: number;
    startDate?: string;
    endDate?: string;
  } = {}
) {
  const { page = 1, limit = 10, search = '', clubId, startDate, endDate } = params;
  return useQuery<{ events: Event[]; total: number }>({
    queryKey: ['events', { page, limit, search, clubId, startDate, endDate }],
    queryFn: () => eventApi.getEvents({ page, limit, search, clubId, startDate, endDate }),
    placeholderData: keepPreviousData,
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: ['event', id],
    queryFn: () => eventApi.getEvent(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      eventApi.updateEvent(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: eventApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpcomingEvents(limit?: number) {
  return useQuery({
    queryKey: ['events', 'upcoming', limit],
    queryFn: () => eventApi.getUpcomingEvents(limit),
  });
}

export function useClubEvents(clubId: number) {
  return useQuery({
    queryKey: ['club', clubId, 'events'],
    queryFn: () => eventApi.getClubEvents(clubId),
    enabled: !!clubId,
  });
}