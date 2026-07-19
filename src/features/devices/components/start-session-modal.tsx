'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import { Device } from '@/types';
import { startSessionSchema, type StartSessionFormData } from '../types';
import { useStartSession } from '@/hooks/use-sessions';
import { useSessionStore } from '@/store/session-store';

interface StartSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
}

export default function StartSessionModal({ isOpen, onClose, device }: StartSessionModalProps) {
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
    <Modal isOpen={isOpen} onClose={onClose} title={`Start Session - ${device?.name}`} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-gray-700">Customer Name (Optional)</span>
          </label>
          <input
            type="text"
            placeholder="Enter customer name"
            className="input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400 transition-all"
            {...register('customerName')}
          />
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-gray-700">Hourly Rate ($)</span>
          </label>
          <input
            type="number"
            step="0.01"
            className={`input input-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400 transition-all ${errors.hourlyRate ? 'input-error border-red-400' : ''}`}
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
            Cancel
          </Button>
          <Button type="submit" variant="success" className="flex-1" loading={isPending}>
            Start Session
          </Button>
        </div>
      </form>
    </Modal>
  );
}
