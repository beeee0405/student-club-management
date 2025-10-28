import { api } from './axios';
import type { User } from '../types';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'USER';
};

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>> & {
  password?: string;
};

export const userApi = {
  // Lấy danh sách users với phân trang và tìm kiếm
  getUsers: async ({ page = 1, limit = 10, search = '' }) => {
    const { data } = await api.get<{ users: User[]; total: number }>('/users', {
      params: { page, limit, search },
    });
    return data;
  },

  // Lấy thông tin một user
  getUser: async (id: number) => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  // Tạo user mới
  createUser: async (userData: CreateUserInput) => {
    const { data } = await api.post<User>('/users', userData);
    return data;
  },

  // Cập nhật user
  updateUser: async (id: number, userData: UpdateUserInput) => {
    const { data } = await api.put<User>(`/users/${id}`, userData);
    return data;
  },

  // Xóa user
  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },
};