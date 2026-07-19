import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryService } from '@/services/inventory-service';
import { QUERY_KEYS } from '@/constants';
import toast from 'react-hot-toast';

export function useLowStockProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, 'low-stock'],
    queryFn: inventoryService.getLowStock,
  });
}

export function useOutOfStockProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, 'out-of-stock'],
    queryFn: inventoryService.getOutOfStock,
  });
}

export function useIncreaseQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      inventoryService.increaseQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success('Quantity increased');
    },
    onError: () => {
      toast.error('Failed to increase quantity');
    },
  });
}

export function useDecreaseQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      inventoryService.decreaseQuantity(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVENTORY] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] });
      toast.success('Quantity decreased');
    },
    onError: () => {
      toast.error('Failed to decrease quantity');
    },
  });
}
