'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Product } from '@/types';
import { productSchema, type ProductFormData } from '../types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSubmit: (data: ProductFormData) => void;
  isLoading?: boolean;
}

export default function ProductForm({ isOpen, onClose, product, onSubmit, isLoading }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      price: product?.price || 0,
      quantity: product?.quantity || 0,
      description: product?.description || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: product?.name || '',
        price: product?.price || 0,
        quantity: product?.quantity || 0,
        description: product?.description || '',
      });
    }
  }, [isOpen, product, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Create Product'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Product Name"
          placeholder="Enter product name"
          error={errors.name?.message}
          {...register('name')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price ($)"
            type="number"
            step="0.01"
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />
          <Input
            label="Quantity"
            type="number"
            error={errors.quantity?.message}
            {...register('quantity', { valueAsNumber: true })}
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium text-gray-700">Description (Optional)</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full rounded-xl bg-gray-50 border-gray-200 focus:border-blue-400 transition-all h-20"
            placeholder="Enter description"
            {...register('description')}
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isLoading}>
            {product ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
