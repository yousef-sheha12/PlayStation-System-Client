import api from '@/lib/axios';

export interface DailyRevenueReport {
  date: string;
  totalRevenue: number;
  deviceRevenue: number;
  productRevenue: number;
  totalSessions: number;
  totalInvoices: number;
  averageSessionDuration: number;
}

export interface MostUsedDeviceReport {
  deviceId: number;
  deviceName: string;
  totalSessions: number;
  totalHours: number;
  totalRevenue: number;
}

export interface MostSoldProductReport {
  productId: number;
  productName: string;
  categoryName: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

export const reportService = {
  getMostUsedDevices: async (count?: number) => {
    const response = await api.get<MostUsedDeviceReport[]>('/reports/most-used-devices', { params: { count } });
    return response.data;
  },

  getMostSoldProducts: async (count?: number) => {
    const response = await api.get<MostSoldProductReport[]>('/reports/most-sold-products', { params: { count } });
    return response.data;
  },
};
