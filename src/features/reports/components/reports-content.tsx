'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import PageHeader from '@/components/layout/page-header';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Loader from '@/components/ui/loader';
import { useDashboard } from '@/hooks/use-dashboard';
import { formatCurrency } from '@/utils';
import { CHART_COLORS } from '@/constants';
import { useTranslation } from '@/hooks/use-translation';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

type ReportType = 'daily' | 'monthly' | 'yearly';

export default function ReportsContent() {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState<ReportType>('daily');
  const { data: dashboard, isLoading: statsLoading } = useDashboard();

  if (statsLoading) return <Loader size="lg" text={t('reports.loadingReports')} />;

  const deviceChartData = {
    labels: dashboard?.deviceUsageChart?.usageByDevice?.map((d) => d.deviceName) || [],
    datasets: [{ data: dashboard?.deviceUsageChart?.usageByDevice?.map((d) => d.revenue) || [], backgroundColor: [CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.purple, CHART_COLORS.pink, CHART_COLORS.indigo], borderWidth: 0 }],
  };

  const productChartData = {
    labels: dashboard?.sessionChart?.topDevices?.map((d) => d.deviceName) || [],
    datasets: [{ label: t('dashboard.revenueByDay'), data: dashboard?.sessionChart?.topDevices?.map((d) => d.revenue) || [], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 8 }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: (v: string | number) => `$${Number(v)}` } },
      x: { grid: { display: false } },
    },
  };

  const reportTypes: { key: ReportType; label: string }[] = [
    { key: 'daily', label: t('reports.daily') },
    { key: 'monthly', label: t('reports.monthly') },
    { key: 'yearly', label: t('reports.yearly') },
  ];

  return (
    <div>
      <PageHeader title={t('reports.title')} subtitle={t('reports.subtitle')} actions={
        <div className="flex gap-2">
          {reportTypes.map((rt) => (
            <Button key={rt.key} variant={reportType === rt.key ? 'primary' : 'ghost'} size="sm" onClick={() => setReportType(rt.key)}>{rt.label}</Button>
          ))}
        </div>
      } />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: t('dashboard.revenueToday'), value: formatCurrency(dashboard?.todayRevenue || 0), icon: DollarSign, gradient: 'from-blue-500 to-blue-600' },
          { title: t('dashboard.revenueMonth'), value: formatCurrency(dashboard?.monthlyRevenue || 0), icon: TrendingUp, gradient: 'from-sky-400 to-sky-500' },
          { title: t('dashboard.todaySessions'), value: dashboard?.activeSessions || 0, icon: Calendar, gradient: 'from-green-400 to-green-500' },
          { title: t('dashboard.activeSessions'), value: dashboard?.activeSessions || 0, icon: BarChart3, gradient: 'from-amber-400 to-amber-500' },
        ].map((item, index) => (
          <motion.div key={item.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 p-6">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center`}><item.icon size={20} className="text-white" /></div>
              <div><p className="text-sm text-gray-500">{item.title}</p><p className="text-xl font-bold text-gray-800">{item.value}</p></div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card hover={false}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.revenueByDay')}</h3>
          <div className="h-72"><Bar data={{ labels: dashboard?.revenueChart?.dailyRevenue?.map((r) => r.date) || [], datasets: [{ data: dashboard?.revenueChart?.dailyRevenue?.map((r) => r.value) || [], backgroundColor: 'rgba(59, 130, 246, 0.8)', borderRadius: 8 }] }} options={barOptions} /></div>
        </Card>
        <Card hover={false}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('reports.revenueByDevice')}</h3>
          <div className="h-72 flex items-center justify-center">
            {dashboard?.deviceUsageChart?.usageByDevice && dashboard.deviceUsageChart.usageByDevice.length > 0 ? (
              <Doughnut data={deviceChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } } }, cutout: '60%' }} />
            ) : <p className="text-gray-400">{t('common.none')}</p>}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card hover={false}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.mostSoldProducts')}</h3>
          <div className="h-72"><Bar data={productChartData} options={barOptions} /></div>
        </Card>
        <Card hover={false}>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('reports.monthlyRevenue')}</h3>
          <div className="h-72"><Bar data={{ labels: dashboard?.revenueChart?.dailyRevenue?.map((r) => r.date) || [], datasets: [{ data: dashboard?.revenueChart?.dailyRevenue?.map((r) => r.value) || [], backgroundColor: 'rgba(14, 165, 233, 0.8)', borderRadius: 8 }] }} options={barOptions} /></div>
        </Card>
      </div>
    </div>
  );
}
