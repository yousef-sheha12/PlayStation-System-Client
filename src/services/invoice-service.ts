import api from '@/lib/axios';
import { Invoice, ApiResponse } from '@/types';

export const invoiceService = {
  getAll: async () => {
    const response = await api.get<Invoice[]>('/invoices');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Invoice>>(`/invoices/${id}`);
    return response.data;
  },

  getBySessionId: async (sessionId: number) => {
    const response = await api.get<ApiResponse<Invoice>>(`/invoices/session/${sessionId}`);
    return response.data;
  },

  generate: async (data: { sessionId: number; discount?: number; taxRate?: number; paymentMethod?: string }) => {
    const response = await api.post<ApiResponse<Invoice>>('/invoices/generate', data);
    return response.data;
  },

  updatePayment: async (invoiceId: number, isPaid: boolean) => {
    const response = await api.put<ApiResponse<Invoice>>(`/invoices/${invoiceId}/payment`, null, { params: { isPaid } });
    return response.data;
  },
};
