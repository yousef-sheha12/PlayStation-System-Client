import api from '@/lib/axios';
import { Customer, PaginatedResponse, ApiResponse } from '@/types';

export const customerService = {
  getAll: async () => {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  },

  getPaginated: async (params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }) => {
    const response = await api.get<PaginatedResponse<Customer>>('/customers/paginated', { params });
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return response.data;
  },

  search: async (searchTerm: string) => {
    const response = await api.get<Customer[]>('/customers/search', { params: { searchTerm } });
    return response.data;
  },

  create: async (data: { name: string; email?: string; phoneNumber?: string; address?: string }) => {
    const response = await api.post<ApiResponse<Customer>>('/customers', data);
    return response.data;
  },

  update: async (id: number, data: { name: string; email?: string; phoneNumber?: string; address?: string }) => {
    const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/customers/${id}`);
    return response.data;
  },
};
