import api from '@/lib/axios';
import { Invoice, Session, SessionProduct } from '@/types';

const SESSION_STATUS_MAP: Record<number, Session['status']> = {
  0: 'Active',
  1: 'Paused',
  2: 'Ended',
};

function mapSessionStatus(session: any): Session {
  return {
    ...session,
    status: typeof session.status === 'number' ? (SESSION_STATUS_MAP[session.status] ?? 'Active') : session.status,
    products: session.products || session.sessionProducts || [],
    sessionProducts: session.sessionProducts || session.products || [],
  };
}

function mapSessions(sessions: any[]): Session[] {
  return sessions.map(mapSessionStatus);
}

const PAYMENT_METHOD_MAP: Record<string, number> = {
  Cash: 0,
  Card: 1,
  MobilePayment: 2,
};

export const sessionService = {
  start: async (data: { deviceId: number; customerId?: number; customerName?: string; hourlyRate: number }): Promise<Session> => {
    const response = await api.post<any>('/sessions/start', {
      deviceId: data.deviceId,
      customerId: data.customerId,
      customerName: data.customerName || undefined,
      hourlyRate: data.hourlyRate,
    });
    return mapSessionStatus(response.data);
  },

  pause: async (id: number): Promise<void> => {
    await api.post(`/sessions/${id}/pause`);
  },

  resume: async (id: number): Promise<void> => {
    await api.post(`/sessions/${id}/resume`);
  },

  end: async (id: number, discount?: number): Promise<Session> => {
    const response = await api.post<any>(`/sessions/${id}/end`, { discount: discount || 0 });
    return mapSessionStatus(response.data);
  },

  endAndInvoice: async (id: number, data: { discount?: number; taxRate?: number; paymentMethod?: string }): Promise<Invoice> => {
    const payload = {
      discount: data.discount || 0,
      taxRate: data.taxRate || 0,
      paymentMethod: data.paymentMethod ? PAYMENT_METHOD_MAP[data.paymentMethod] ?? 0 : 0,
    };
    const response = await api.post<Invoice>(`/sessions/${id}/end-and-invoice`, payload);
    return response.data;
  },

  getActive: async (): Promise<Session[]> => {
    const response = await api.get<any[]>('/sessions/active');
    return mapSessions(response.data);
  },

  getAll: async (): Promise<Session[]> => {
    const response = await api.get<any[]>('/sessions');
    return mapSessions(response.data);
  },

  getById: async (id: number): Promise<Session> => {
    const response = await api.get<any>(`/sessions/${id}`);
    return mapSessionStatus(response.data);
  },

  getByStatus: async (status: string): Promise<Session[]> => {
    const response = await api.get<any[]>(`/sessions/status/${status}`);
    return mapSessions(response.data);
  },

  getByDevice: async (deviceId: number): Promise<Session[]> => {
    const response = await api.get<any[]>(`/sessions/device/${deviceId}`);
    return mapSessions(response.data);
  },

  getByDateRange: async (startDate: string, endDate: string): Promise<Session[]> => {
    const response = await api.get<any[]>('/sessions/date-range', { params: { startDate, endDate } });
    return mapSessions(response.data);
  },

  addProduct: async (sessionId: number, data: { productId: number; quantity: number }): Promise<void> => {
    await api.post(`/sessions/${sessionId}/products`, data);
  },

  removeProduct: async (sessionId: number, productId: number): Promise<void> => {
    await api.delete(`/sessions/${sessionId}/products/${productId}`);
  },
};
