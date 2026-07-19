import api from '@/lib/axios';
import { DashboardDto, ApiResponse } from '@/types';

export const dashboardService = {
  getDashboard: async () => {
    const response = await api.get<ApiResponse<DashboardDto>>('/dashboard');
    return response.data;
  },
};
