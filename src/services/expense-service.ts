import api from '@/lib/axios';
import { Expense, PaginatedResponse } from '@/types';

export const expenseService = {
  getAll: async (): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses');
    return response.data;
  },

  getPaginated: async (params?: { pageNumber?: number; pageSize?: number; searchTerm?: string; startDate?: string; endDate?: string }): Promise<PaginatedResponse<Expense>> => {
    const response = await api.get<PaginatedResponse<Expense>>('/expenses/paginated', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Expense> => {
    const response = await api.get<Expense>(`/expenses/${id}`);
    return response.data;
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Expense[]> => {
    const response = await api.get<Expense[]>('/expenses/date-range', { params: { startDate, endDate } });
    return response.data;
  },

  create: async (data: { description: string; amount: number; category?: string; expenseDate: string; notes?: string }) => {
    const response = await api.post<Expense>('/expenses', data);
    return response.data;
  },

  update: async (id: number, data: { description: string; amount: number; category?: string; expenseDate: string; notes?: string }) => {
    const response = await api.put<Expense>(`/expenses/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<void>(`/expenses/${id}`);
    return response.data;
  },
};
