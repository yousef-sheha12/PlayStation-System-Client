'use client';

import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';
import Card from '@/components/ui/card';
import { MostUsedDevice } from '@/types';
import { formatCurrency } from '@/utils';
import { useTranslation } from '@/hooks/use-translation';

interface MostUsedDevicesProps {
  devices: MostUsedDevice[];
}

export default function MostUsedDevices({ devices }: MostUsedDevicesProps) {
  const { t } = useTranslation();
  const maxSessions = Math.max(...devices.map((d) => d.totalSessions), 1);

  return (
    <Card hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <Gamepad2 size={20} className="text-sky-500" />
        <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.mostUsedDevices')}</h3>
      </div>
      <div className="space-y-3">
        {devices.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">{t('common.none')}</p>
        ) : (
          devices.map((device, index) => (
            <motion.div key={device.deviceName} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-xl flex items-center justify-center">
                <Gamepad2 size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{device.deviceName}</span>
                  <span className="text-xs text-gray-500">{device.totalSessions}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(device.totalSessions / maxSessions) * 100}%` }} transition={{ duration: 0.8, delay: index * 0.1 }} className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-800 min-w-[80px] text-right">{formatCurrency(device.totalRevenue)}</span>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
