import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionService } from '@/services/session-service';
import { QUERY_KEYS } from '@/constants';
import toast from 'react-hot-toast';

export function useActiveSessions() {
  return useQuery({
    queryKey: [QUERY_KEYS.SESSIONS, 'active'],
    queryFn: sessionService.getActive,
    refetchInterval: 30000,
  });
}

export function useSession(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.SESSIONS, id],
    queryFn: () => sessionService.getById(id),
    enabled: !!id,
  });
}

export function useStartSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sessionService.start,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SESSIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      toast.success('Session started');
      return data;
    },
    onError: () => {
      toast.error('Failed to start session');
    },
  });
}

export function useEndSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, discount }: { id: number; discount?: number }) =>
      sessionService.end(id, discount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SESSIONS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD] });
      toast.success('Session ended');
    },
    onError: () => {
      toast.error('Failed to end session');
    },
  });
}

export function useAddSessionProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: number; data: { productId: number; quantity: number } }) =>
      sessionService.addProduct(sessionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SESSIONS] });
      toast.success('Product added to session');
    },
    onError: () => {
      toast.error('Failed to add product');
    },
  });
}

export function useRemoveSessionProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sessionId, productId }: { sessionId: number; productId: number }) =>
      sessionService.removeProduct(sessionId, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SESSIONS] });
      toast.success('Product removed');
    },
    onError: () => {
      toast.error('Failed to remove product');
    },
  });
}
