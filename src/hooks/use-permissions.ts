import { useAuthStore } from '@/store/auth-store';

export function usePermissions() {
  const { user, isAdmin, isWorker } = useAuthStore();

  return {
    user,
    isAdmin: isAdmin(),
    isWorker: isWorker(),

    canManageProducts: isAdmin(),
    canManageCategories: isAdmin(),
    canManageInventory: isAdmin(),
    canManageExpenses: isAdmin(),
    canManageReports: isAdmin(),
    canManageSettings: isAdmin(),
    canManageDevices: isAdmin(),

    canViewProducts: true,
    canViewCategories: true,
    canViewDevices: true,
    canViewCustomers: true,
    canViewInvoices: true,

    canStartSession: true,
    canEndSession: true,
    canAddToCart: true,
  };
}
