'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoice } from '@/hooks/use-invoices';
import InvoiceDetail from '@/features/invoices/components/invoice-detail';
import Loader from '@/components/ui/loader';

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const invoiceId = parseInt(id);
  const { data, isLoading } = useInvoice(invoiceId);
  const router = useRouter();

  if (isLoading) return <Loader size="lg" text="Loading invoice..." />;
  if (!data) return <div className="text-center py-12 text-gray-500">Invoice not found</div>;

  return <InvoiceDetail invoice={data} onBack={() => router.push('/invoices')} />;
}
