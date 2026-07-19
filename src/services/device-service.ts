import api from '@/lib/axios';
import { Device, ApiResponse } from '@/types';

export const deviceService = {
  getAll: async () => {
    const response = await api.get<Device[]>('/devices');
    return response.data;
  },

  getById: async (id: number) => {
    const response = await api.get<ApiResponse<Device>>(`/devices/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description?: string; hourlyRate: number; status: string }) => {
    const response = await api.post<ApiResponse<Device>>('/devices', data);
    return response.data;
  },

  update: async (id: number, data: { name: string; description?: string; hourlyRate: number; status: string }) => {
    const response = await api.put<ApiResponse<Device>>(`/devices/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/devices/${id}`);
    return response.data;
  },
};
