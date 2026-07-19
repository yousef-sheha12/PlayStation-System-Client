'use client';

import { useState } from 'react';
import DeviceCard from './device-card';
import StartSessionModal from './start-session-modal';
import EndSessionModal from './end-session-modal';
import PageHeader from '@/components/layout/page-header';
import Loader from '@/components/ui/loader';
import { useDevices } from '@/hooks/use-devices';
import { useSessionStore } from '@/store/session-store';
import { useTranslation } from '@/hooks/use-translation';
import { Device } from '@/types';

export default function DevicesContent() {
  const { t } = useTranslation();
  const { data: devices, isLoading } = useDevices();
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const { timers } = useSessionStore();

  const handleStartSession = (device: Device) => { setSelectedDevice(device); setStartModalOpen(true); };
  const handleEndSession = (device: Device) => { setSelectedDevice(device); setEndModalOpen(true); };

  if (isLoading) return <Loader size="lg" text={t('devices.loadingDevices')} />;

  const deviceList = devices || [];

  return (
    <div>
      <PageHeader title={t('devices.title')} subtitle={t('devices.subtitle', { count: deviceList.length })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {deviceList.map((device) => (
          <DeviceCard key={device.id} device={device} onStartSession={handleStartSession} onEndSession={handleEndSession} />
        ))}
      </div>
      {deviceList.length === 0 && <p className="text-gray-400 text-center py-16">{t('devices.noDevices')}</p>}
      <StartSessionModal isOpen={startModalOpen} onClose={() => setStartModalOpen(false)} device={selectedDevice} />
      <EndSessionModal isOpen={endModalOpen} onClose={() => setEndModalOpen(false)} device={selectedDevice} elapsedSeconds={selectedDevice ? timers.get(selectedDevice.id)?.elapsedSeconds || 0 : 0} />
    </div>
  );
}
