import { api } from './axios';
import type { Event } from '../types';

export const eventApi = {
  // Lấy danh sách events với phân trang, tìm kiếm và filter
  getEvents: async ({
    page = 1,
    limit = 10,
    search = '',
    clubId,
    startDate,
    endDate,
  }: {
    page?: number;
    limit?: number;
    search?: string;
    clubId?: number;
    startDate?: string;
    endDate?: string;
  }) => {
    const { data } = await api.get<{ events: Event[]; total: number }>('/events', {
      params: { page, limit, search, clubId, startDate, endDate },
    });
    return data;
  },

  // Lấy thông tin một event
  getEvent: async (id: number) => {
    const { data } = await api.get<Event>(`/events/${id}`);
    return data;
  },

  // Tạo event mới
  createEvent: async (eventData: FormData) => {
    const { data } = await api.post<Event>('/events', eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Cập nhật event
  updateEvent: async (id: number, eventData: FormData) => {
    const { data } = await api.put<Event>(`/events/${id}`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Xóa event
  deleteEvent: async (id: number) => {
    await api.delete(`/events/${id}`);
  },

  // Lấy danh sách events sắp tới
  getUpcomingEvents: async (limit: number = 5) => {
    const { data } = await api.get<Event[]>('/events/upcoming', {
      params: { limit },
    });
    return data;
  },

  // Lấy danh sách events của một club
  getClubEvents: async (clubId: number) => {
    const { data } = await api.get<Event[]>(`/clubs/${clubId}/events`);
    return data;
  },
};