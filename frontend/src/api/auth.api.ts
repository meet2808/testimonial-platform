import apiClient from './axios';
import type { ApiResponse, Admin } from '../types';
import type { LoginFormData } from '../schemas/auth.schema';

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (data: LoginFormData): Promise<ApiResponse<{ token: string }>> => {
    const res = await apiClient.post<ApiResponse<{ token: string }>>('/auth/login', data);
    return res.data;
  },

  logout: async (): Promise<ApiResponse> => {
    const res = await apiClient.post<ApiResponse>('/auth/logout');
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<Admin>> => {
    const res = await apiClient.get<ApiResponse<Admin>>('/auth/me');
    return res.data;
  },
};
