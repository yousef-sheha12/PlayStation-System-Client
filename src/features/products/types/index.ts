import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  quantity: z.number().min(0, 'Quantity cannot be negative'),
  categoryId: z.number().min(1, 'Category is required'),
  description: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
