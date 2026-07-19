import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { customerService } from '@/services/customer-service';
import { QUERY_KEYS } from '@/constants';
import { PaginatedResponse, Customer } from '@/types';
import toast from 'react-hot-toast';

export function useCustomers(params: { pageNumber?: number; pageSize?: number; searchTerm?: string }) {
  return useQuery<PaginatedResponse<Customer>>({
    queryKey: [QUERY_KEYS.CUSTOMERS, params],
    queryFn: () => customerService.getPaginated(params),
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.CUSTOMERS, id],
    queryFn: () => customerService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
      toast.success('Customer created successfully');
    },
    onError: () => {
      toast.error('Failed to create customer');
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; email?: string; phoneNumber?: string; address?: string } }) =>
      customerService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
      toast.success('Customer updated successfully');
    },
    onError: () => {
      toast.error('Failed to update customer');
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMERS] });
      toast.success('Customer deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete customer');
    },
  });
}
