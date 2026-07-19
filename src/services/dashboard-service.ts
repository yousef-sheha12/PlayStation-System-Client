import api from '@/lib/axios';
import { DashboardDto } from '@/types';

export const dashboardService = {
  getDashboard: async (): Promise<DashboardDto> => {
    const response = await api.get<DashboardDto>('/dashboard');
    return response.data;
  },
};
