'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Gamepad2, Plus, Edit3, Trash2, DollarSign } from 'lucide-react';
import PageHeader from '@/components/layout/page-header';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import Input from '@/components/ui/input';
import Loader from '@/components/ui/loader';
import { useDevices, useCreateDevice, useUpdateDevice, useDeleteDevice } from '@/hooks/use-devices';
import { useCategories } from '@/hooks/use-categories';
import { formatCurrency } from '@/utils';
import { Device } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from '@/hooks/use-translation';
import { usePermissions } from '@/hooks/use-permissions';

const deviceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  hourlyRate: z.number().min(0.01, 'Rate must be > 0'),
});
type DeviceFormData = z.infer<typeof deviceSchema>;

export default function SettingsContent() {
  const { t } = useTranslation();
  const { canManageDevices } = usePermissions();
  const { data: devices = [], isLoading } = useDevices();
  const { data: categories = [] } = useCategories();
  const { mutate: createDevice, isPending: creating } = useCreateDevice();
  const { mutate: updateDevice, isPending: updating } = useUpdateDevice();
  const { mutate: deleteDevice, isPending: deleting } = useDeleteDevice();

  const [formOpen, setFormOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [rateModal, setRateModal] = useState<Device | null>(null);
  const [newRate, setNewRate] = useState(0);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
  });

  const handleFormSubmit = (data: DeviceFormData) => {
    if (editingDevice) {
      updateDevice({ id: editingDevice.id, data: { ...data, status: editingDevice.status } }, {
        onSuccess: () => { setFormOpen(false); setEditingDevice(null); reset(); },
      });
    } else {
      createDevice(data, {
        onSuccess: () => { setFormOpen(false); reset(); },
      });
    }
  };

  const handleRateUpdate = () => {
    if (!rateModal) return;
    updateDevice({ id: rateModal.id, data: { name: rateModal.name, hourlyRate: newRate, status: rateModal.status } }, {
      onSuccess: () => setRateModal(null),
    });
  };

  return (
    <div>
      <PageHeader title={t('settings.title')} subtitle={t('settings.subtitle')} />

      <Card hover={false} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Gamepad2 size={24} className="text-blue-500" />
            <div>
              <h2 className="text-lg font-bold text-gray-800">{t('settings.devicesManagement')}</h2>
              <p className="text-sm text-gray-500">{t('settings.devicesCount', { count: devices.length })}</p>
            </div>
          </div>
          {canManageDevices && (
            <Button icon={<Plus size={16} />} onClick={() => { setEditingDevice(null); setFormOpen(true); }}>
              {t('settings.addDevice')}
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="p-8 text-center"><Loader size="lg" text={t('settings.loadingSettings')} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center">
                      <Gamepad2 size={16} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{device.name}</h3>
                      <Badge variant={device.status === 'Available' ? 'success' : device.status === 'Occupied' ? 'danger' : 'warning'} size="sm">
                        {device.status === 'Available' ? t('devices.available') : device.status === 'Occupied' ? t('devices.occupied') : t('devices.maintenance')}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{t('devices.hourlyRate')}</span>
                  <span className="font-bold text-blue-600">{formatCurrency(device.hourlyRate)}</span>
                </div>
                <div className="flex gap-2">
                  {canManageDevices && (
                    <Button variant="ghost" size="sm" className="flex-1" icon={<DollarSign size={14} />}
                      onClick={() => { setRateModal(device); setNewRate(device.hourlyRate); }}>
                      {t('devices.hourlyRate')}
                    </Button>
                  )}
                  {canManageDevices && (
                    <>
                      <Button variant="ghost" size="sm" icon={<Edit3 size={14} />}
                        onClick={() => { setEditingDevice(device); setFormOpen(true); }} />
                      <Button variant="ghost" size="sm" icon={<Trash2 size={14} className="text-red-500" />}
                        onClick={() => setDeleteId(device.id)} />
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      <Card hover={false}>
        <div className="flex items-center gap-3 mb-6">
          <Settings size={24} className="text-blue-500" />
          <div>
            <h2 className="text-lg font-bold text-gray-800">{t('settings.categoriesTitle')}</h2>
            <p className="text-sm text-gray-500">{t('settings.categoriesCount', { count: categories.length })}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-blue-50/50 rounded-xl p-3 text-center">
              <p className="font-medium text-gray-800">{cat.name}</p>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditingDevice(null); reset(); }} title={editingDevice ? t('settings.editDevice') : t('settings.addDevice')} size="sm">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input label={t('settings.deviceName')} placeholder={t('settings.deviceNamePlaceholder')} error={errors.name?.message} {...register('name')} />
          <Input label={t('devices.hourlyRate')} type="number" step="0.01" error={errors.hourlyRate?.message} {...register('hourlyRate', { valueAsNumber: true })} />
          <div className="flex gap-3">
            <Button type="button" variant="ghost" className="flex-1" onClick={() => { setFormOpen(false); setEditingDevice(null); reset(); }}>{t('common.cancel')}</Button>
            <Button type="submit" variant="primary" className="flex-1" loading={creating || updating}>{editingDevice ? t('common.save') : t('common.add')}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!rateModal} onClose={() => setRateModal(null)} title={t('settings.updateRate')} size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">{t('settings.updateRateDesc', { device: rateModal?.name || '' })}</p>
          <Input label={t('settings.newHourlyRate')} type="number" step="0.01" value={newRate} onChange={(e) => setNewRate(Number(e.target.value))} />
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setRateModal(null)}>{t('common.cancel')}</Button>
            <Button variant="primary" className="flex-1" loading={updating} onClick={handleRateUpdate}>{t('common.save')}</Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => { if (deleteId) deleteDevice(deleteId, { onSuccess: () => setDeleteId(null) }); }}
        title={t('settings.editDevice')}
        message={t('settings.updateRateDesc', { device: '' })}
        confirmText={t('common.delete')}
        loading={deleting}
      />
    </div>
  );
}
