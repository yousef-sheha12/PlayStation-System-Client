'use client';

import { useState, useEffect } from 'react';
import DeviceCard from './device-card';
import StartSessionModal from './start-session-modal';
import EndSessionModal from './end-session-modal';
import AddProductModal from './add-product-modal';
import PageHeader from '@/components/layout/page-header';
import Loader from '@/components/ui/loader';
import { useDevices } from '@/hooks/use-devices';
import { useSessionStore } from '@/store/session-store';
import { useTranslation } from '@/hooks/use-translation';
import { Device, Session } from '@/types';
import { sessionService } from '@/services/session-service';

export default function DevicesContent() {
  const { t } = useTranslation();
  const { data: devices, isLoading } = useDevices();
  const [startModalOpen, setStartModalOpen] = useState(false);
  const [endModalOpen, setEndModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const { timers, activeSessions, addSession } = useSessionStore();

  useEffect(() => {
    if (!devices || devices.length === 0) return;
    sessionService.getActive().then((sessions: Session[]) => {
      sessions.forEach((session) => {
        const device = devices.find((d) => d.id === session.deviceId);
        if (device && !activeSessions.has(device.id)) {
          addSession(device, session);
        }
      });
    }).catch(() => {});
  }, [devices]);

  const handleStartSession = (device: Device) => { setSelectedDevice(device); setStartModalOpen(true); };
  const handleEndSession = (device: Device) => { setSelectedDevice(device); setEndModalOpen(true); };
  const handleAddProduct = (device: Device) => {
    const session = activeSessions.get(device.id);
    if (session) {
      setSelectedSessionId(session.id);
      setAddProductOpen(true);
    }
  };

  if (isLoading) return <Loader size="lg" text={t('devices.loadingDevices')} />;

  const deviceList = devices || [];

  return (
    <div>
      <PageHeader title={t('devices.title')} subtitle={t('devices.subtitle', { count: deviceList.length })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {deviceList.map((device) => (
          <DeviceCard key={device.id} device={device} onStartSession={handleStartSession} onEndSession={handleEndSession} onAddProduct={handleAddProduct} />
        ))}
      </div>
      {deviceList.length === 0 && <p className="text-gray-400 text-center py-16">{t('devices.noDevices')}</p>}
      <StartSessionModal isOpen={startModalOpen} onClose={() => setStartModalOpen(false)} device={selectedDevice} />
      <EndSessionModal isOpen={endModalOpen} onClose={() => setEndModalOpen(false)} device={selectedDevice} elapsedSeconds={selectedDevice ? timers.get(selectedDevice.id)?.elapsedSeconds || 0 : 0} />
      {selectedSessionId && (
        <AddProductModal isOpen={addProductOpen} onClose={() => { setAddProductOpen(false); setSelectedSessionId(null); }} sessionId={selectedSessionId} />
      )}
    </div>
  );
}
