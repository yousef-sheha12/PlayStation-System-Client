export interface User {
  id: number;
  email: string;
  name: string;
  role: 'Admin' | 'Worker';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  productCount: number;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  lowStockThreshold: number;
  categoryId: number;
  categoryName: string;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export interface Device {
  id: number;
  name: string;
  description?: string;
  hourlyRate: number;
  status: 'Available' | 'Occupied' | 'Maintenance';
  activeSessionCount: number;
}

export interface Session {
  id: number;
  deviceId: number;
  deviceName: string;
  customerId?: number;
  customerName?: string;
  startTime: string;
  endTime?: string;
  hourlyRate: number;
  totalHours: number;
  deviceCost: number;
  productsCost: number;
  discount: number;
  totalCost: number;
  status: 'Active' | 'Paused' | 'Completed';
  products: SessionProduct[];
  sessionProducts: SessionProduct[];
}

export interface SessionProduct {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  sessionCount: number;
}

export interface Invoice {
  id: number;
  sessionId: number;
  invoiceNumber: string;
  deviceName: string;
  customerName?: string;
  subTotal: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'Card' | 'DigitalWallet';
  isPaid: boolean;
  paidAt?: string;
  createdAt: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  category?: string;
  expenseDate: string;
  notes?: string;
}

export interface DashboardDto {
  todayRevenue: number;
  monthlyRevenue: number;
  activeSessions: number;
  totalDevices: number;
  availableDevices: number;
  occupiedDevices: number;
  totalProducts: number;
  lowStockCount: number;
  totalCustomers: number;
  todayExpenses: number;
  monthlyExpenses: number;
  deviceSummaries: DeviceStatusSummary[];
  revenueChart: RevenueChartData;
  expenseChart: ExpenseChartData;
  deviceUsageChart: DeviceUsageChartData;
  sessionChart: SessionChartData;
}

export interface DeviceStatusSummary {
  deviceName: string;
  status: string;
  hourlyRate: number;
  activeMinutes: number;
}

export interface RevenueChartData {
  dailyRevenue: DailyMetric[];
  dailyExpenses: DailyMetric[];
  dailyProfit: DailyMetric[];
}

export interface ExpenseChartData {
  byCategory: CategoryMetric[];
  dailyExpenses: DailyMetric[];
}

export interface DeviceUsageChartData {
  usageByDevice: DeviceUsageMetric[];
  statusDistribution: StatusDistributionMetric[];
}

export interface SessionChartData {
  sessionsByHour: HourlyMetric[];
  dailySessions: DailyMetric[];
  topDevices: DeviceSessionMetric[];
}

export interface DailyMetric {
  date: string;
  value: number;
}

export interface CategoryMetric {
  category: string;
  amount: number;
  count: number;
}

export interface DeviceUsageMetric {
  deviceName: string;
  usageHours: number;
  revenue: number;
}

export interface StatusDistributionMetric {
  status: string;
  count: number;
}

export interface HourlyMetric {
  hour: number;
  sessionCount: number;
}

export interface DeviceSessionMetric {
  deviceName: string;
  sessionCount: number;
  revenue: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ReportParams {
  startDate?: string;
  endDate?: string;
  type: 'daily' | 'monthly' | 'yearly';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ActiveSessionTimer {
  sessionId: number;
  deviceId: number;
  deviceName: string;
  startTime: string;
  hourlyRate: number;
  elapsedSeconds: number;
}

export interface MostSoldProduct {
  productName: string;
  totalQuantity: number;
  totalRevenue: number;
}

export interface MostUsedDevice {
  deviceName: string;
  totalSessions: number;
  totalRevenue: number;
}
