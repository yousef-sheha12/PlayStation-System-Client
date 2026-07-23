import { useAuthStore } from '@/store/auth-store';

export function usePermissions() {
  const { user, isAdmin, isWorker } = useAuthStore();

  return {
    user,
    isAdmin: isAdmin(),
    isWorker: isWorker(),

    canManageProducts: isAdmin(),
    canManageDevices: isAdmin(),
    canManageSettings: isAdmin(),
    canViewDashboard: isAdmin(),

    canViewDevices: true,
    canViewProducts: isAdmin(),
    canViewInvoices: isAdmin(),
    canViewReports: isAdmin(),

    canStartSession: true,
    canEndSession: true,
    canAddToCart: true,
  };
}
