import api from '@/lib/axios';
import { Device, ApiResponse } from '@/types';

const STATUS_MAP: Record<number, Device['status']> = {
  0: 'Available',
  1: 'Occupied',
  2: 'Maintenance',
};

function mapDeviceStatus(device: any): Device {
  return {
    ...device,
    status: typeof device.status === 'number' ? (STATUS_MAP[device.status] ?? 'Available') : device.status,
  };
}

function mapDevices(devices: any[]): Device[] {
  return devices.map(mapDeviceStatus);
}

export const deviceService = {
  getAll: async (): Promise<Device[]> => {
    const response = await api.get<any[]>('/devices');
    return mapDevices(response.data);
  },

  getById: async (id: number): Promise<Device> => {
    const response = await api.get<any>(`/devices/${id}`);
    return mapDeviceStatus(response.data);
  },

  create: async (data: { name: string; description?: string; hourlyRate: number }) => {
    const response = await api.post<any>('/devices', data);
    return response.data;
  },

  update: async (id: number, data: { name?: string; description?: string; hourlyRate?: number; status?: string }) => {
    const response = await api.put<any>(`/devices/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    const response = await api.delete<void>(`/devices/${id}`);
    return response.data;
  },
};
