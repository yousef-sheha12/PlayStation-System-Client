'use client';

import {
  DollarSign,
  CalendarDays,
  Clock,
  PlayCircle,
  Monitor,
  MonitorOff,
  Package,
  AlertTriangle,
} from 'lucide-react';
import StatsCard from './stats-card';
import RevenueChart from './revenue-chart';
import MonthlyRevenueChart from './monthly-revenue-chart';
import MostSoldProducts from './most-sold-products';
import MostUsedDevices from './most-used-devices';
import PageHeader from '@/components/layout/page-header';
import Loader from '@/components/ui/loader';
import { useDashboard } from '@/hooks/use-dashboard';
import { formatCurrency } from '@/utils';
import { useTranslation } from '@/hooks/use-translation';

export default function DashboardContent() {
  const { t } = useTranslation();
  const { data: response, isLoading: statsLoading } = useDashboard();
  const dashboard = response?.data;

  if (statsLoading) {
    return <Loader size="lg" text={t('dashboard.loadingDashboard')} />;
  }

  const statCards = [
    { title: t('dashboard.revenueToday'), value: formatCurrency(dashboard?.todayRevenue || 0), icon: DollarSign, color: 'text-blue-500', gradient: 'from-blue-500 to-blue-600' },
    { title: t('dashboard.revenueMonth'), value: formatCurrency(dashboard?.monthlyRevenue || 0), icon: CalendarDays, color: 'text-sky-500', gradient: 'from-sky-400 to-sky-500' },
    { title: t('dashboard.todaySessions'), value: dashboard?.activeSessions || 0, icon: Clock, color: 'text-green-500', gradient: 'from-green-400 to-green-500' },
    { title: t('dashboard.activeSessions'), value: dashboard?.activeSessions || 0, icon: PlayCircle, color: 'text-amber-500', gradient: 'from-amber-400 to-amber-500' },
    { title: t('dashboard.availableDevices'), value: dashboard?.availableDevices || 0, icon: Monitor, color: 'text-emerald-500', gradient: 'from-emerald-400 to-emerald-500' },
    { title: t('dashboard.occupiedDevices'), value: dashboard?.occupiedDevices || 0, icon: MonitorOff, color: 'text-red-500', gradient: 'from-red-400 to-red-500' },
    { title: t('dashboard.productsCount'), value: dashboard?.totalProducts || 0, icon: Package, color: 'text-purple-500', gradient: 'from-purple-400 to-purple-500' },
    { title: t('dashboard.lowStockCount'), value: dashboard?.lowStockCount || 0, icon: AlertTriangle, color: 'text-rose-500', gradient: 'from-rose-400 to-rose-500' },
  ];

  return (
    <div>
      <PageHeader title={t('dashboard.title')} subtitle={t('dashboard.subtitle')} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <StatsCard key={card.title} {...card} index={index} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RevenueChart
          labels={dashboard?.revenueChart?.dailyRevenue?.map((r) => r.date) || []}
          data={dashboard?.revenueChart?.dailyRevenue?.map((r) => r.value) || []}
          title={t('dashboard.revenueByDay')}
        />
        <MonthlyRevenueChart
          labels={dashboard?.revenueChart?.dailyRevenue?.map((r) => r.date) || []}
          data={dashboard?.revenueChart?.dailyRevenue?.map((r) => r.value) || []}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MostSoldProducts products={[]} />
        <MostUsedDevices devices={[]} />
      </div>
    </div>
  );
}
