import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseService } from '@/services/expense-service';
import { QUERY_KEYS } from '@/constants';
import { PaginatedResponse, Expense } from '@/types';
import toast from 'react-hot-toast';

export function useExpenses(params: { pageNumber?: number; pageSize?: number; searchTerm?: string; startDate?: string; endDate?: string }) {
  return useQuery<PaginatedResponse<Expense>>({
    queryKey: [QUERY_KEYS.EXPENSES, params],
    queryFn: () => expenseService.getPaginated(params),
  });
}

export function useExpense(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPENSES, id],
    queryFn: () => expenseService.getById(id),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSES] });
      toast.success('Expense created successfully');
    },
    onError: () => {
      toast.error('Failed to create expense');
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { description: string; amount: number; category?: string; expenseDate: string; notes?: string } }) =>
      expenseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSES] });
      toast.success('Expense updated successfully');
    },
    onError: () => {
      toast.error('Failed to update expense');
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: expenseService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSES] });
      toast.success('Expense deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete expense');
    },
  });
}
