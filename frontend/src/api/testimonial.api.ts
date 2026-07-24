import apiClient from './axios';
import {
  ApiResponse,
  Testimonial,
  PaginatedData,
  AdminStats,
  AdminTestimonialQuery,
} from '../types';
import { CreateTestimonialFormData } from '../schemas/testimonial.schema';

// ─── Testimonial API ──────────────────────────────────────────────────────────

export const testimonialApi = {
  // ── Public ──────────────────────────────────────────────────────────────────

  submit: async (data: CreateTestimonialFormData): Promise<ApiResponse<Testimonial>> => {
    // Must use FormData because the request may include a file upload
    const formData = new FormData();
    formData.append('customerName', data.customerName);
    formData.append('email', data.email);
    formData.append('company', data.company);
    formData.append('message', data.message);
    formData.append('rating', String(data.rating));
    formData.append('consentGiven', String(data.consentGiven));

    if (data.profileImage) {
      formData.append('profileImage', data.profileImage);
    }

    const res = await apiClient.post<ApiResponse<Testimonial>>(
      '/testimonials',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return res.data;
  },

  getPublic: async (): Promise<ApiResponse<Testimonial[]>> => {
    const res = await apiClient.get<ApiResponse<Testimonial[]>>('/testimonials/public');
    return res.data;
  },

  getWidget: async (): Promise<ApiResponse<Testimonial[]>> => {
    const res = await apiClient.get<ApiResponse<Testimonial[]>>('/testimonials/widget');
    return res.data;
  },

  // ── Admin ────────────────────────────────────────────────────────────────────

  getAllAdmin: async (
    query: AdminTestimonialQuery
  ): Promise<ApiResponse<PaginatedData<Testimonial>>> => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Testimonial>>>(
      '/testimonials/admin',
      { params: query }
    );
    return res.data;
  },

  getOne: async (id: string): Promise<ApiResponse<Testimonial>> => {
    const res = await apiClient.get<ApiResponse<Testimonial>>(
      `/testimonials/admin/${id}`
    );
    return res.data;
  },

  approve: async (id: string): Promise<ApiResponse<Testimonial>> => {
    const res = await apiClient.patch<ApiResponse<Testimonial>>(
      `/testimonials/admin/${id}/approve`
    );
    return res.data;
  },

  reject: async (id: string): Promise<ApiResponse<Testimonial>> => {
    const res = await apiClient.patch<ApiResponse<Testimonial>>(
      `/testimonials/admin/${id}/reject`
    );
    return res.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    const res = await apiClient.delete<ApiResponse>(
      `/testimonials/admin/${id}`
    );
    return res.data;
  },

  getStats: async (): Promise<ApiResponse<AdminStats>> => {
    const res = await apiClient.get<ApiResponse<AdminStats>>(
      '/testimonials/admin/stats'
    );
    return res.data;
  },
};
