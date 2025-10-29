import { api } from './axios';
import type { Club, Member } from '../types';

export const clubApi = {
  // Lấy danh sách clubs với phân trang và tìm kiếm
  getClubs: async ({ page = 1, limit = 10, search = '', type = '' }) => {
    const { data } = await api.get<{ clubs: Club[]; total: number }>('/clubs', {
      params: { page, limit, search, type },
    });
    return data;
  },

  // Lấy thông tin một club
  getClub: async (id: number) => {
    const { data } = await api.get<Club>(`/clubs/${id}`);
    return data;
  },

  // Tạo club mới
  createClub: async (clubData: FormData) => {
    const { data } = await api.post<Club>('/clubs', clubData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Cập nhật club
  updateClub: async (id: number, clubData: FormData) => {
    const { data } = await api.put<Club>(`/clubs/${id}`, clubData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // Xóa club
  deleteClub: async (id: number) => {
    await api.delete(`/clubs/${id}`);
  },

  // Lấy danh sách thành viên của club
  getClubMembers: async (clubId: number) => {
    const { data } = await api.get<Member[]>(`/clubs/${clubId}/members`);
    return data;
  },

  // Thêm thành viên vào club
  addClubMember: async (clubId: number, userId: number, role: string = 'member') => {
    const { data } = await api.post<Member>(`/clubs/${clubId}/members`, {
      userId,
      role,
    });
    return data;
  },

  // Xóa thành viên khỏi club
  removeClubMember: async (clubId: number, userId: number) => {
    await api.delete(`/clubs/${clubId}/members/${userId}`);
  },
};