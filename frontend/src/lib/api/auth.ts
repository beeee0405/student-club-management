import { api } from './axios';
import type { User } from '../types';

interface AuthResponse {
  user: User;
  token: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authApi = {
  // Đăng nhập
  login: async (data: LoginData) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    // Lưu token vào localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  // Đăng ký
  register: async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    // Lưu token vào localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem('token');
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    const { data } = await api.get<User>('/auth/me');
    return data;
  },
};