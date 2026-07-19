import api from '@/lib/axios';
import { Invoice } from '@/types';

export const invoiceService = {
  getAll: async (): Promise<Invoice[]> => {
    const response = await api.get<Invoice[]>('/invoices');
    return response.data;
  },

  getById: async (id: number): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },

  getBySessionId: async (sessionId: number): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/invoices/session/${sessionId}`);
    return response.data;
  },

  generate: async (data: { sessionId: number; discount?: number; taxRate?: number; paymentMethod?: string }) => {
    const response = await api.post<Invoice>('/invoices/generate', data);
    return response.data;
  },

  updatePayment: async (invoiceId: number, isPaid: boolean) => {
    const response = await api.put<Invoice>(`/invoices/${invoiceId}/payment`, null, { params: { isPaid } });
    return response.data;
  },
};
