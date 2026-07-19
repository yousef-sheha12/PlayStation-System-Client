'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye } from 'lucide-react';
import PageHeader from '@/components/layout/page-header';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Loader from '@/components/ui/loader';
import { useInvoices } from '@/hooks/use-invoices';
import { formatCurrency, formatDate } from '@/utils';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';

export default function InvoicesContent() {
  const { t } = useTranslation();
  const { data: invoices = [], isLoading } = useInvoices();
  const router = useRouter();

  return (
    <div>
      <PageHeader title={t('invoices.title')} subtitle={t('invoices.subtitle')} />

      <Card hover={false} padding={false}>
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader size="lg" text={t('invoices.loadingInvoices')} />
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-400">{t('invoices.noInvoices')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-gray-600">{t('invoices.invoiceNumber')}</th>
                  <th className="text-gray-600">{t('invoices.date')}</th>
                  <th className="text-gray-600">{t('invoices.device')}</th>
                  <th className="text-gray-600">{t('invoices.customer')}</th>
                  <th className="text-gray-600">{t('invoices.duration')}</th>
                  <th className="text-gray-600">{t('invoices.total')}</th>
                  <th className="text-gray-600 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice: any, index: number) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50/50"
                  >
                    <td>
                      <Badge variant="info">{invoice.invoiceNumber}</Badge>
                    </td>
                    <td className="text-sm text-gray-600">{formatDate(invoice.createdAt)}</td>
                    <td className="font-medium text-gray-800">{invoice.deviceName || t('common.none')}</td>
                    <td className="text-gray-600">{invoice.customerName || t('common.walkIn')}</td>
                    <td className="text-gray-600">{invoice.paymentMethod}</td>
                    <td className="font-bold text-green-600">{formatCurrency(invoice.totalAmount)}</td>
                    <td>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<Eye size={14} />}
                          onClick={() => router.push(`/invoices/${invoice.id}`)}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
