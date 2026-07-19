'use client';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Filler, Title, Tooltip, Legend } from 'chart.js';
import Card from '@/components/ui/card';
import { CHART_COLORS } from '@/constants';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Filler, Title, Tooltip, Legend);

interface MonthlyRevenueChartProps {
  labels: string[];
  data: number[];
}

export default function MonthlyRevenueChart({ labels, data }: MonthlyRevenueChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Monthly Revenue',
        data,
        borderColor: CHART_COLORS.primary,
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: CHART_COLORS.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 8,
        callbacks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          label: (context: any) => `$${(context.parsed.y ?? 0).toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { callback: (value: string | number) => `$${Number(value)}` },
      },
      x: {
        grid: { display: false },
      },
    },
  };

  return (
    <Card hover={false}>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Trend</h3>
      <div className="h-72">
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
}
