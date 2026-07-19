import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deviceService } from '@/services/device-service';
import { QUERY_KEYS } from '@/constants';
import toast from 'react-hot-toast';

export function useDevices() {
  return useQuery({
    queryKey: [QUERY_KEYS.DEVICES],
    queryFn: deviceService.getAll,
  });
}

export function useDevice(id: number) {
  return useQuery({
    queryKey: [QUERY_KEYS.DEVICES, id],
    queryFn: () => deviceService.getById(id),
    enabled: !!id,
  });
}

export function useCreateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      toast.success('Device added successfully');
    },
    onError: () => {
      toast.error('Failed to add device');
    },
  });
}

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; description?: string; hourlyRate: number; status: string } }) =>
      deviceService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      toast.success('Device updated successfully');
    },
    onError: () => {
      toast.error('Failed to update device');
    },
  });
}

export function useDeleteDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deviceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEVICES] });
      toast.success('Device deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete device');
    },
  });
}
