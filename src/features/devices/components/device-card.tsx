'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, PauseCircle, StopCircle, DollarSign, Clock, Gamepad2 } from 'lucide-react';
import { Device } from '@/types';
import { formatCurrency, formatTime } from '@/utils';
import { useSessionStore } from '@/store/session-store';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { usePauseSession, useResumeSession } from '@/hooks/use-sessions';
import { useTranslation } from '@/hooks/use-translation';

interface DeviceCardProps {
  device: Device;
  onStartSession: (device: Device) => void;
  onEndSession: (device: Device) => void;
}

export default function DeviceCard({ device, onStartSession, onEndSession }: DeviceCardProps) {
  const { t } = useTranslation();
  const [elapsed, setElapsed] = useState(0);
  const { activeSessions, timers, updateElapsed, pauseTimer, resumeTimer } = useSessionStore();
  const { mutate: pauseSession } = usePauseSession();
  const { mutate: resumeSession } = useResumeSession();
  const isActive = device.status === 'Occupied';
  const session = activeSessions.get(device.id);
  const timer = timers.get(device.id);
  const isPaused = timer?.pausedAt !== undefined;

  useEffect(() => {
    if (!isActive || !timer || isPaused) return;
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const start = Math.floor(new Date(timer.startTime).getTime() / 1000);
      setElapsed(now - start);
      updateElapsed(device.id, now - start);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, timer, isPaused, device.id, updateElapsed]);

  useEffect(() => { if (isPaused && timer) setElapsed(timer.pausedAt!); }, [isPaused, timer]);

  const currentCost = formatCurrency((elapsed / 3600) * device.hourlyRate);
  const statusVariant = isActive ? 'danger' : device.status === 'Maintenance' ? 'warning' : 'success';
  const statusLabel = isActive ? t('devices.occupied') : device.status === 'Available' ? t('devices.available') : t('devices.maintenance');

  const gradientMap: Record<string, string> = {
    Available: 'from-green-400 to-emerald-500',
    Occupied: 'from-red-400 to-rose-500',
    Maintenance: 'from-amber-400 to-orange-500',
  };

  const handlePause = () => { if (!session) return; pauseSession(session.id, { onSuccess: () => pauseTimer(device.id) }); };
  const handleResume = () => { if (!session) return; resumeSession(session.id, { onSuccess: () => resumeTimer(device.id) }); };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -6, boxShadow: '0 25px 50px rgba(59, 130, 246, 0.15)' }} transition={{ duration: 0.3 }} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${gradientMap[device.status] || 'from-blue-400 to-blue-500'}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div animate={isActive ? { scale: [1, 1.1, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }} className="w-12 h-12 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Gamepad2 size={22} className="text-white" />
            </motion.div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{device.name}</h3>
              <Badge variant={statusVariant} size="sm">{statusLabel}</Badge>
            </div>
          </div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 flex items-center gap-1"><DollarSign size={14} /> {t('devices.hourlyRate')}</span>
            <span className="font-semibold text-gray-800">{formatCurrency(device.hourlyRate)}</span>
          </div>
          {isActive && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1"><Clock size={14} /> {t('devices.elapsed')}</span>
                <span className={`font-mono font-bold text-lg ${isPaused ? 'text-amber-500' : 'text-blue-600'}`}>{formatTime(elapsed)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{t('devices.currentCost')}</span>
                <span className="font-bold text-green-600">{currentCost}</span>
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2">
          {!isActive ? (
            <Button variant="success" size="sm" className="flex-1" icon={<PlayCircle size={16} />} onClick={() => onStartSession(device)}>{t('devices.startSession')}</Button>
          ) : isPaused ? (
            <>
              <Button variant="success" size="sm" className="flex-1" icon={<PlayCircle size={16} />} onClick={handleResume}>{t('devices.resume')}</Button>
              <Button variant="danger" size="sm" className="flex-1" icon={<StopCircle size={16} />} onClick={() => onEndSession(device)}>{t('devices.end')}</Button>
            </>
          ) : (
            <>
              <Button variant="primary" size="sm" className="flex-1" icon={<PauseCircle size={16} />} onClick={handlePause}>{t('devices.pause')}</Button>
              <Button variant="danger" size="sm" className="flex-1" icon={<StopCircle size={16} />} onClick={() => onEndSession(device)}>{t('devices.end')}</Button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
