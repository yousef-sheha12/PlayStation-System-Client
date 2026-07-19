import { z } from 'zod';

export const customerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
});

export type CustomerFormData = z.infer<typeof customerSchema>;
