import api from '@/lib/axios';
import { Category, ApiResponse } from '@/types';

export const categoryService = {
  getAll: async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.post<ApiResponse<Category>>('/categories', data);
    return response.data;
  },

  update: async (id: number, data: { name: string; description?: string }) => {
    const response = await api.put<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/categories/${id}`);
    return response.data;
  },
};
