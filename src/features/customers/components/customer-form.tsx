'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Customer } from '@/types';
import { customerSchema, type CustomerFormData } from '../types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSubmit: (data: CustomerFormData) => void;
  isLoading?: boolean;
}

export default function CustomerForm({ isOpen, onClose, customer, onSubmit, isLoading }: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer?.name || '',
      email: customer?.email || '',
        phoneNumber: customer?.phoneNumber || '',
      address: customer?.address || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: customer?.name || '',
        email: customer?.email || '',
      phoneNumber: customer?.phoneNumber || '',
        address: customer?.address || '',
      });
    }
  }, [isOpen, customer, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={customer ? 'Edit Customer' : 'Create Customer'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Customer Name"
          placeholder="Enter customer name"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Email (Optional)"
          type="email"
          placeholder="customer@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Phone (Optional)"
          type="tel"
          placeholder="+1 (555) 000-0000"
          {...register('phoneNumber')}
        />
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-gray-700">Address (Optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400 transition-all h-20"
            placeholder="Enter address"
            {...register('address')}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isLoading}>
            {customer ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
