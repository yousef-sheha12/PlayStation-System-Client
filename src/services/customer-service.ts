import api from '@/lib/axios';
import { Customer, PaginatedResponse } from '@/types';

export const customerService = {
  getAll: async (): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/customers');
    return response.data;
  },

  getPaginated: async (params?: { pageNumber?: number; pageSize?: number; searchTerm?: string }): Promise<PaginatedResponse<Customer>> => {
    const response = await api.get<PaginatedResponse<Customer>>('/customers/paginated', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const response = await api.get<Customer>(`/customers/${id}`);
    return response.data;
  },

  search: async (searchTerm: string): Promise<Customer[]> => {
    const response = await api.get<Customer[]>('/customers/search', { params: { searchTerm } });
    return response.data;
  },

  create: async (data: { name: string; email?: string; phoneNumber?: string; address?: string }) => {
    const response = await api.post<Customer>('/customers', data);
    return response.data;
  },

  update: async (id: number, data: { name: string; email?: string; phoneNumber?: string; address?: string }) => {
    const response = await api.put<Customer>(`/customers/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<void>(`/customers/${id}`);
    return response.data;
  },
};
