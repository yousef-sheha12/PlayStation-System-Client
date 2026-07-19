import { z } from 'zod';

export const expenseSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  expenseDate: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;
