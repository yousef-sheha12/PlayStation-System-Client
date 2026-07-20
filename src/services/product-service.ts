import api from '@/lib/axios';
import { Product, PaginatedResponse } from '@/types';

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getPaginated: async (params?: { pageNumber?: number; pageSize?: number; searchTerm?: string; categoryId?: number; isLowStock?: boolean }): Promise<PaginatedResponse<Product>> => {
    const response = await api.get<PaginatedResponse<Product>>('/products/paginated', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  search: async (searchTerm: string): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/search', { params: { searchTerm } });
    return response.data;
  },

  create: async (data: { name: string; description?: string; price: number; quantity: number; lowStockThreshold?: number; categoryId?: number }) => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: number, data: { name: string; description?: string; price: number; quantity: number; lowStockThreshold?: number; categoryId?: number }) => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<void>(`/products/${id}`);
    return response.data;
  },
};
