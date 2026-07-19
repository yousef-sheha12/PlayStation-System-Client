'use client';

import { Suspense } from 'react';
import InvoicesContent from '@/features/invoices/components/invoices-content';
import Loader from '@/components/ui/loader';

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center"><Loader size="lg" text="Loading..." /></div>}>
      <InvoicesContent />
    </Suspense>
  );
}
