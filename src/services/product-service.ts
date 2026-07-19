import api from '@/lib/axios';
import { Product, PaginatedResponse, ApiResponse } from '@/types';

export const productService = {
  getAll: async () => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getPaginated: async (params?: { pageNumber?: number; pageSize?: number; searchTerm?: string; categoryId?: number; isLowStock?: boolean }) => {
    const response = await api.get<PaginatedResponse<Product>>('/products/paginated', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data;
  },

  search: async (searchTerm: string) => {
    const response = await api.get<Product[]>('/products/search', { params: { searchTerm } });
    return response.data;
  },

  create: async (data: { name: string; description?: string; price: number; quantity: number; lowStockThreshold?: number; categoryId: number }) => {
    const response = await api.post<ApiResponse<Product>>('/products', data);
    return response.data;
  },

  update: async (id: number, data: { name: string; description?: string; price: number; quantity: number; lowStockThreshold?: number; categoryId: number }) => {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data;
  },
};
