import api from '@/lib/axios';
import { Category } from '@/types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string }) => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  update: async (id: number, data: { name: string; description?: string }) => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<void>(`/categories/${id}`);
    return response.data;
  },
};
