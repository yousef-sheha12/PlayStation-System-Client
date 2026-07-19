import api from '@/lib/axios';
import { Session, ApiResponse, SessionProduct } from '@/types';

export const sessionService = {
  start: async (data: { deviceId: number; customerId?: number; customerName?: string; hourlyRate: number }) => {
    const response = await api.post<ApiResponse<Session>>('/sessions/start', data);
    return response.data;
  },

  pause: async (id: number) => {
    const response = await api.post<ApiResponse<Session>>(`/sessions/${id}/pause`);
    return response.data;
  },

  resume: async (id: number) => {
    const response = await api.post<ApiResponse<Session>>(`/sessions/${id}/resume`);
    return response.data;
  },

  end: async (id: number, discount?: number) => {
    const response = await api.post<ApiResponse<Session>>(`/sessions/${id}/end`, discount ? { discount } : undefined);
    return response.data;
  },

  getActive: async () => {
    const response = await api.get<Session[]>('/sessions/active');
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<Session[]>('/sessions');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Session>>(`/sessions/${id}`);
    return response.data;
  },

  getByStatus: async (status: string) => {
    const response = await api.get<Session[]>(`/sessions/status/${status}`);
    return response.data;
  },

  getByDevice: async (deviceId: number) => {
    const response = await api.get<Session[]>(`/sessions/device/${deviceId}`);
    return response.data;
  },

  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await api.get<Session[]>('/sessions/date-range', { params: { startDate, endDate } });
    return response.data;
  },

  addProduct: async (sessionId: number, data: { productId: number; quantity: number }) => {
    const response = await api.post<ApiResponse<SessionProduct>>(`/sessions/${sessionId}/products`, data);
    return response.data;
  },

  removeProduct: async (sessionId: number, productId: number) => {
    const response = await api.delete<ApiResponse<void>>(`/sessions/${sessionId}/products/${productId}`);
    return response.data;
  },
};
