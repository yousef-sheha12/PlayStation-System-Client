import { z } from 'zod';

export const startSessionSchema = z.object({
  customerName: z.string().optional(),
  hourlyRate: z.number().min(0.01, 'Hourly rate must be greater than 0'),
});

export type StartSessionFormData = z.infer<typeof startSessionSchema>;

export const addDeviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  hourlyRate: z.number().min(0.01, 'Hourly rate must be greater than 0'),
});

export type AddDeviceFormData = z.infer<typeof addDeviceSchema>;

export const updateHourlyRateSchema = z.object({
  hourlyRate: z.number().min(0.01, 'Hourly rate must be greater than 0'),
});

export type UpdateHourlyRateFormData = z.infer<typeof updateHourlyRateSchema>;
