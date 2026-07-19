import { z } from 'zod';

export const reportFilterSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  type: z.enum(['daily', 'monthly', 'yearly']),
});

export type ReportFilterData = z.infer<typeof reportFilterSchema>;
