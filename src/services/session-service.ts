import api from '@/lib/axios';
import { Session, SessionProduct } from '@/types';

export const sessionService = {
  start: async (data: { deviceId: number; customerId?: number; customerName?: string; hourlyRate: number }): Promise<Session> => {
    const response = await api.post<Session>('/sessions/start', {
      deviceId: data.deviceId,
      customerName: data.customerName || undefined,
      hourlyRate: data.hourlyRate,
    });
    return response.data;
  },

  pause: async (id: number): Promise<Session> => {
    const response = await api.post<Session>(`/sessions/${id}/pause`);
    return response.data;
  },

  resume: async (id: number): Promise<Session> => {
    const response = await api.post<Session>(`/sessions/${id}/resume`);
    return response.data;
  },

  end: async (id: number, discount?: number): Promise<Session> => {
    const response = await api.post<Session>(`/sessions/${id}/end`, { discount: discount || 0 });
    return response.data;
  },

  getActive: async (): Promise<Session[]> => {
    const response = await api.get<Session[]>('/sessions/active');
    return response.data;
  },

  getAll: async (): Promise<Session[]> => {
    const response = await api.get<Session[]>('/sessions');
    return response.data;
  },

  getById: async (id: number): Promise<Session> => {
    const response = await api.get<Session>(`/sessions/${id}`);
    return response.data;
  },

  getByStatus: async (status: string): Promise<Session[]> => {
    const response = await api.get<Session[]>(`/sessions/status/${status}`);
    return response.data;
  },

  getByDevice: async (deviceId: number): Promise<Session[]> => {
    const response = await api.get<Session[]>(`/sessions/device/${deviceId}`);
    return response.data;
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Session[]> => {
    const response = await api.get<Session[]>('/sessions/date-range', { params: { startDate, endDate } });
    return response.data;
  },

  addProduct: async (sessionId: number, data: { productId: number; quantity: number }): Promise<SessionProduct> => {
    const response = await api.post<SessionProduct>(`/sessions/${sessionId}/products`, data);
    return response.data;
  },

  removeProduct: async (sessionId: number, productId: number) => {
    const response = await api.delete<void>(`/sessions/${sessionId}/products/${productId}`);
    return response.data;
  },
};
