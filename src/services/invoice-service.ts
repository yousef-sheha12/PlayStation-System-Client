import api from '@/lib/axios';
import { Invoice } from '@/types';

const PAYMENT_METHOD_MAP: Record<string, number> = {
  Cash: 0,
  Card: 1,
  MobilePayment: 2,
};

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

  generate: async (data: { sessionId: number; discount?: number; taxRate?: number; paymentMethod?: string }): Promise<Invoice> => {
    const payload = {
      sessionId: data.sessionId,
      discount: data.discount || 0,
      taxRate: data.taxRate || 0,
      paymentMethod: data.paymentMethod ? PAYMENT_METHOD_MAP[data.paymentMethod] ?? 0 : 0,
    };
    const response = await api.post<Invoice>('/invoices/generate', payload);
    return response.data;
  },

  updatePayment: async (invoiceId: number, isPaid: boolean) => {
    const response = await api.put<Invoice>(`/invoices/${invoiceId}/payment`, null, { params: { isPaid } });
    return response.data;
  },
};
