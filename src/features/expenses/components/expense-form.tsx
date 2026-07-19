'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Expense } from '@/types';
import { expenseSchema, type ExpenseFormData } from '../types';
import { EXPENSE_CATEGORIES } from '@/constants';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  expense?: Expense | null;
  onSubmit: (data: ExpenseFormData) => void;
  isLoading?: boolean;
}

export default function ExpenseForm({ isOpen, onClose, expense, onSubmit, isLoading }: ExpenseFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      description: expense?.description || '',
      amount: expense?.amount || 0,
      category: expense?.category || '',
      expenseDate: expense?.expenseDate ? expense.expenseDate.split('T')[0] : new Date().toISOString().split('T')[0],
      notes: expense?.notes || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        description: expense?.description || '',
        amount: expense?.amount || 0,
        category: expense?.category || '',
        expenseDate: expense?.expenseDate ? expense.expenseDate.split('T')[0] : new Date().toISOString().split('T')[0],
        notes: expense?.notes || '',
      });
    }
  }, [isOpen, expense, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={expense ? 'Edit Expense' : 'Create Expense'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Description"
          placeholder="Expense description"
          error={errors.description?.message}
          {...register('description')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Amount ($)"
            type="number"
            step="0.01"
            error={errors.amount?.message}
            {...register('amount', { valueAsNumber: true })}
          />
          <Input
            label="Date"
            type="date"
            error={errors.expenseDate?.message}
            {...register('expenseDate')}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-gray-700">Category</span>
          </label>
          <select
            className={`select select-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400 transition-all ${errors.category ? 'select-error border-red-400' : ''}`}
            {...register('category')}
          >
            <option value="">Select Category</option>
            {EXPENSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && (
            <label className="label">
              <span className="label-text-alt text-red-500">{errors.category.message}</span>
            </label>
          )}
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-gray-700">Notes (Optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400 transition-all h-20"
            placeholder="Enter notes"
            {...register('notes')}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isLoading}>
            {expense ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
