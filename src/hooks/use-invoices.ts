import { useQuery } from '@tanstack/react-query';
import { invoiceService } from '@/services/invoice-service';
import { QUERY_KEYS } from '@/constants';

export function useInvoices() {
  return useQuery({
    queryKey: [QUERY_KEYS.INVOICES],
    queryFn: () => invoiceService.getAll(),
  });
}

export function useInvoice(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.INVOICES, id],
    queryFn: () => invoiceService.getById(id),
    enabled: !!id,
  });
}
