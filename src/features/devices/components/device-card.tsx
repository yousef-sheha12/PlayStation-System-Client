'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, StopCircle, DollarSign, Clock, Gamepad2, ShoppingBag } from 'lucide-react';
import { Device } from '@/types';
import { formatCurrency, formatTime } from '@/utils';
import { useSessionStore } from '@/store/session-store';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';

interface DeviceCardProps {
  device: Device;
  onStartSession: (device: Device) => void;
  onEndSession: (device: Device) => void;
  onAddProduct?: (device: Device) => void;
}

export default function DeviceCard({ device, onStartSession, onEndSession, onAddProduct }: DeviceCardProps) {
  const { t } = useTranslation();
  const [elapsed, setElapsed] = useState(0);

  const isActive = device.status === 'Occupied';
  const timer = useSessionStore((s) => s.timers.get(device.id));

  useEffect(() => {
    if (!isActive || !timer) return;
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const start = Math.floor(new Date(timer.startTime).getTime() / 1000);
      const newElapsed = Math.max(0, now - start);
      setElapsed(newElapsed);
      useSessionStore.getState().updateElapsed(device.id, newElapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timer, device.id]);

  const currentCost = formatCurrency(isNaN(elapsed) || !device.hourlyRate ? 0 : (elapsed / 3600) * device.hourlyRate);
  const statusVariant = isActive ? 'danger' : device.status === 'Maintenance' ? 'warning' : 'success';
  const statusLabel = isActive ? t('devices.occupied') : device.status === 'Available' ? t('devices.available') : t('devices.maintenance');

  const gradientMap: Record<string, string> = {
    Available: 'from-green-400 to-emerald-500',
    Occupied: 'from-red-400 to-rose-500',
    Maintenance: 'from-amber-400 to-orange-500',
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(59, 130, 246, 0.15)' }} transition={{ duration: 0.3 }} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden">
      <div className={`h-3 bg-gradient-to-r ${gradientMap[device.status] || 'from-blue-400 to-blue-500'}`} />
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }} className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Gamepad2 size={30} className="text-white" />
            </motion.div>
            <div>
              <h3 className="font-bold text-gray-800 text-xl">{device.name}</h3>
              <Badge variant={statusVariant} size="sm">{statusLabel}</Badge>
            </div>
          </div>
        </div>
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5"><DollarSign size={16} /> {t('devices.hourlyRate')}</span>
            <span className="font-semibold text-gray-800 text-lg">{formatCurrency(device.hourlyRate)}</span>
          </div>
          {isActive && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 flex items-center gap-1.5"><Clock size={16} /> {t('devices.elapsed')}</span>
                <span className="font-mono font-bold text-xl text-blue-600">{formatTime(isNaN(elapsed) ? 0 : elapsed)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">{t('devices.currentCost')}</span>
                <span className="font-bold text-green-600 text-lg">{currentCost}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          {!isActive ? (
            <Button variant="success" size="md" className="flex-1" icon={<PlayCircle size={18} />} onClick={() => onStartSession(device)}>{t('devices.startSession')}</Button>
          ) : (
            <>
              {onAddProduct && (
                <Button variant="ghost" size="md" icon={<ShoppingBag size={16} />} onClick={() => onAddProduct(device)}>{t('devices.addProduct')}</Button>
              )}
              <Button variant="danger" size="md" className="flex-1" icon={<StopCircle size={18} />} onClick={() => onEndSession(device)}>{t('devices.end')}</Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
