'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category } from '@/types';
import { categorySchema, type CategoryFormData } from '../types';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category | null;
  onSubmit: (data: CategoryFormData) => void;
  isLoading?: boolean;
}

export default function CategoryForm({ isOpen, onClose, category, onSubmit, isLoading }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || '',
      description: category?.description || '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: category?.name || '',
        description: category?.description || '',
      });
    }
  }, [isOpen, category, reset]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={category ? 'Edit Category' : 'Create Category'} size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Category Name"
          placeholder="Enter category name"
          error={errors.name?.message}
          {...register('name')}
        />
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
          <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1" loading={isLoading}>
            {category ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
