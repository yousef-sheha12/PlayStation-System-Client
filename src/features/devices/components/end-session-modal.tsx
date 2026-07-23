'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import { Device } from '@/types';
import { useEndSession } from '@/hooks/use-sessions';
import { useSessionStore } from '@/store/session-store';
import { formatCurrency, formatTime } from '@/utils';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { invoiceService } from '@/services/invoice-service';
import { sessionService } from '@/services/session-service';
import toast from 'react-hot-toast';

interface EndSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
  elapsedSeconds: number;
}

export default function EndSessionModal({ isOpen, onClose, device, elapsedSeconds }: EndSessionModalProps) {
  const { t } = useTranslation();
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'MobilePayment'>('Cash');
  const { mutate: endSession, isPending } = useEndSession();
  const { getSession, removeSession } = useSessionStore();
  const router = useRouter();

  const session = device ? getSession(device.id) : undefined;
  const [sessionProducts, setSessionProducts] = useState(session?.products || []);

  useEffect(() => {
    if (!isOpen || !session?.id) return;
    sessionService.getById(session.id).then((s) => {
      setSessionProducts(s.products || s.sessionProducts || []);
    }).catch(() => {});
  }, [isOpen, session?.id]);

  const hourlyCost = device ? (elapsedSeconds / 3600) * device.hourlyRate : 0;
  const productsCost = sessionProducts.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const subtotal = hourlyCost + productsCost;
  const grandTotal = Math.max(0, subtotal - discount);

  const handleEnd = () => {
    const currentSession = device ? useSessionStore.getState().getSession(device.id) : undefined;
    if (!currentSession || !device) return;
    endSession(
      { id: currentSession.id, discount },
      {
        onSuccess: async () => {
          try {
            const invoice = await invoiceService.generate({
              sessionId: currentSession.id,
              discount,
              taxRate: 0,
              paymentMethod,
            });
            removeSession(device.id);
            onClose();
            if (invoice?.id) {
              router.push(`/invoices/${invoice.id}`);
            } else {
              router.push('/invoices');
            }
          } catch (error: any) {
            removeSession(device.id);
            onClose();
            router.push('/invoices');
            const msg = error?.response?.data?.error || error?.response?.data?.message || 'Session ended but invoice generation failed';
            toast.error(msg);
          }
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
            <span className="font-semibold text-gray-800">{device?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('devices.duration')}</span>
            <span className="font-mono font-semibold text-gray-800">{formatTime(elapsedSeconds)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('devices.hourlyRate')}</span>
            <span className="text-gray-800">{formatCurrency(device?.hourlyRate || 0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{t('devices.timeCost')}</span>
            <span className="font-semibold text-gray-800">{formatCurrency(hourlyCost)}</span>
          </div>

          {sessionProducts.length > 0 && (
            <>
              <div className="divider my-1" />
              <p className="text-sm font-medium text-gray-600">{t('devices.products')}:</p>
              {sessionProducts.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.productName} x{item.quantity}</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t('devices.productsCost')}</span>
                <span className="font-semibold text-gray-800">{formatCurrency(productsCost)}</span>
              </div>
            </>
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
              className="input input-bordered w-full rounded-xl bg-white border-gray-200 text-gray-800 placeholder:text-gray-400 focus:border-blue-400 transition-all"
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-gray-700">{t('invoices.paymentMethod')}</span>
            </label>
            <div className="flex gap-2">
              {(['Cash', 'Card', 'MobilePayment'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                    paymentMethod === method
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {method === 'Cash' ? t('payment.cash') : method === 'Card' ? t('payment.card') : t('payment.mobile')}
                </button>
              ))}
            </div>
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
