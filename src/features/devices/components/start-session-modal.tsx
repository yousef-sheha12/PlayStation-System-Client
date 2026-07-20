'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import { Device } from '@/types';
import { startSessionSchema, type StartSessionFormData } from '../types';
import { useStartSession } from '@/hooks/use-sessions';
import { useSessionStore } from '@/store/session-store';
import { useTranslation } from '@/hooks/use-translation';

interface StartSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
}

export default function StartSessionModal({ isOpen, onClose, device }: StartSessionModalProps) {
  const { t } = useTranslation();
  const { mutate: startSession, isPending } = useStartSession();
  const addSession = useSessionStore((s) => s.addSession);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StartSessionFormData>({
    resolver: zodResolver(startSessionSchema),
    defaultValues: {
      hourlyRate: device?.hourlyRate || 10,
    },
  });

  useEffect(() => {
    if (device) {
      reset({ hourlyRate: device.hourlyRate });
    }
  }, [device, reset]);

  const onSubmit = (data: StartSessionFormData) => {
    if (!device) return;
    startSession(
      {
        deviceId: device.id,
        customerName: data.customerName || undefined,
        hourlyRate: data.hourlyRate,
      },
      {
        onSuccess: (response) => {
          if (response) {
            addSession(device, response);
          }
          reset();
          onClose();
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('devices.startSessionTitle', { device: device?.name || '' })} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-gray-700">{t('devices.customerName')}</span>
          </label>
          <input
            type="text"
            placeholder={t('devices.customerNamePlaceholder')}
            className="input input-bordered w-full rounded-xl bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 transition-all"
            {...register('customerName')}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-gray-700">{t('devices.hourlyRateLabel')}</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`input input-bordered w-full rounded-xl bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 transition-all ${errors.hourlyRate ? 'input-error border-red-400' : ''}`}
            {...register('hourlyRate', { valueAsNumber: true })}
          />
          {errors.hourlyRate && (
            <label className="label">
              <span className="label-text-alt text-red-500">{errors.hourlyRate.message}</span>
            </label>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="success" className="flex-1" loading={isPending}>
            {t('devices.startSession')}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
