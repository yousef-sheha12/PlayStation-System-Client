'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import { Device } from '@/types';
import { useEndSession } from '@/hooks/use-sessions';
import { useSessionStore } from '@/store/session-store';
import { useCartStore } from '@/store/cart-store';
import { formatCurrency, formatTime } from '@/utils';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

interface EndSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  elapsedSeconds: number;
}

export default function EndSessionModal({ isOpen, onClose, device, elapsedSeconds }: EndSessionModalProps) {
  const { t } = useTranslation();
  const [discount, setDiscount] = useState(0);
  const { mutate: endSession, isPending } = useEndSession();
  const { getSession, removeSession } = useSessionStore();
  const { items, clearCart } = useCartStore();
  const router = useRouter();

  const session = device ? getSession(device.id) : undefined;
  const hourlyCost = device ? (elapsedSeconds / 3600) * device.hourlyRate : 0;
  const productsCost = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const subtotal = hourlyCost + productsCost;
  const grandTotal = Math.max(0, subtotal - discount);

  const handleEnd = () => {
    if (!session || !device) return;
    endSession(
      { id: session.id },
      {
        onSuccess: () => {
          removeSession(device.id);
          clearCart();
          onClose();
          router.push(`/invoices?sessionId=${session.id}`);
        },
      }
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('devices.endSessionTitle')} size="md">
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('invoices.device')}</span>
            <span className="font-semibold">{device?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('devices.duration')}</span>
            <span className="font-mono font-semibold">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('devices.hourlyRate')}</span>
            <span>{formatCurrency(device?.hourlyRate || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('devices.timeCost')}</span>
            <span className="font-semibold">{formatCurrency(hourlyCost)}</span>
          </div>
          {productsCost > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{t('devices.productsCost')}</span>
              <span className="font-semibold">{formatCurrency(productsCost)}</span>
            </div>
          )}
          <div className="divider my-1" />
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">{t('devices.discount')}</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="input input-bordered w-full rounded-xl bg-white border-gray-200 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="divider my-1" />
          <div className="flex justify-between">
            <span className="font-bold text-gray-800">{t('devices.grandTotal')}</span>
            <span className="font-bold text-xl text-green-600">{formatCurrency(grandTotal)}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button variant="danger" className="flex-1" loading={isPending} onClick={handleEnd}>
            {t('devices.end')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
