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

    canViewProducts: true,
    canViewDevices: true,
    canViewInvoices: true,

    canStartSession: true,
    canEndSession: true,
    canAddToCart: true,
  };
}
