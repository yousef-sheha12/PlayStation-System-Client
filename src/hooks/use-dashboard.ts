import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard-service';
import { QUERY_KEYS } from '@/constants';

export function useDashboard() {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD],
    queryFn: dashboardService.getDashboard,
    refetchInterval: 60000,
  });
}
