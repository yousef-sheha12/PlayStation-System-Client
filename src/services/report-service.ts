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

export interface MonthlyRevenueReport {
  year: number;
  month: number;
  monthName: string;
  totalRevenue: number;
  deviceRevenue: number;
  productRevenue: number;
  totalSessions: number;
  averageDailyRevenue: number;
}

export interface YearlyRevenueReport {
  year: number;
  totalRevenue: number;
  deviceRevenue: number;
  productRevenue: number;
  totalSessions: number;
  averageMonthlyRevenue: number;
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

export interface ExpensesReport {
  startDate: string;
  endDate: string;
  totalExpenses: number;
  categoryBreakdown: { category: string; amount: number; count: number }[];
}

export interface ProfitReport {
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export const reportService = {
  getDailyRevenue: async (date?: string) => {
    const response = await api.get<DailyRevenueReport>('/reports/daily-revenue', { params: { date } });
    return response.data;
  },

  getMonthlyRevenue: async (year?: number, month?: number) => {
    const response = await api.get<MonthlyRevenueReport>('/reports/monthly-revenue', { params: { year, month } });
    return response.data;
  },

  getYearlyRevenue: async (year?: number) => {
    const response = await api.get<YearlyRevenueReport>('/reports/yearly-revenue', { params: { year } });
    return response.data;
  },

  getMostUsedDevices: async (count?: number) => {
    const response = await api.get<MostUsedDeviceReport[]>('/reports/most-used-devices', { params: { count } });
    return response.data;
  },

  getMostSoldProducts: async (count?: number) => {
    const response = await api.get<MostSoldProductReport[]>('/reports/most-sold-products', { params: { count } });
    return response.data;
  },

  getExpensesReport: async (startDate: string, endDate: string) => {
    const response = await api.get<ExpensesReport>('/reports/expenses', { params: { startDate, endDate } });
    return response.data;
  },

  getProfitReport: async (startDate: string, endDate: string) => {
    const response = await api.get<ProfitReport>('/reports/profit', { params: { startDate, endDate } });
    return response.data;
  },
};
