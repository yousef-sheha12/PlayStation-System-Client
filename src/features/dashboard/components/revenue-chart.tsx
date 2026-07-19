'use client';

import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Card from '@/components/ui/card';
import { CHART_COLORS } from '@/constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RevenueChartProps {
  labels: string[];
  data: number[];
  title: string;
}

export default function RevenueChart({ labels, data, title }: RevenueChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data,
        backgroundColor: `rgba(59, 130, 246, 0.8)`,
        borderColor: CHART_COLORS.primary,
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
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
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-72">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
}
