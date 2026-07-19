'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Tag } from 'lucide-react';
import PageHeader from '@/components/layout/page-header';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import Loader from '@/components/ui/loader';
import CategoryForm from './category-form';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/use-categories';
import { Category } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

export default function CategoriesContent() {
  const { t } = useTranslation();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data: categories = [], isLoading } = useCategories();
  const { mutate: createCategory, isPending: creating } = useCreateCategory();
  const { mutate: updateCategory, isPending: updating } = useUpdateCategory();
  const { mutate: deleteCategory, isPending: deleting } = useDeleteCategory();

  const handleFormSubmit = (data: import('@/features/categories/types').CategoryFormData) => {
    if (editingCategory) {
      updateCategory({ id: editingCategory.id, data }, { onSuccess: () => { setFormOpen(false); setEditingCategory(null); } });
    } else {
      createCategory(data, { onSuccess: () => setFormOpen(false) });
    }
  };

  return (
    <div>
      <PageHeader title={t('categories.title')} subtitle={t('categories.subtitle')} actions={<Button icon={<Plus size={16} />} onClick={() => { setEditingCategory(null); setFormOpen(true); }}>{t('categories.addCategory')}</Button>} />
      <Card hover={false} padding={false}>
        {isLoading ? (
          <div className="p-8 text-center"><Loader size="lg" text={t('categories.loadingCategories')} /></div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center"><Tag size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-400">{t('categories.noCategories')}</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {categories.map((cat, index) => (
              <motion.div key={cat.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="bg-white/60 backdrop-blur-sm rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-400 rounded-xl flex items-center justify-center"><Tag size={16} className="text-white" /></div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" icon={<Edit3 size={14} />} onClick={() => { setEditingCategory(cat); setFormOpen(true); }} />
                    <Button variant="ghost" size="sm" icon={<Trash2 size={14} className="text-red-500" />} onClick={() => setDeleteId(cat.id)} />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                {cat.description && <p className="text-sm text-gray-500 mt-1">{cat.description}</p>}
                <p className="text-xs text-gray-400 mt-2">{cat.productCount} Products</p>
              </motion.div>
            ))}
          </div>
        )}
      </Card>
      <CategoryForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditingCategory(null); }} category={editingCategory} onSubmit={handleFormSubmit} isLoading={creating || updating} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={() => { if (deleteId) deleteCategory(deleteId, { onSuccess: () => setDeleteId(null) }); }} title={t('categories.deleteTitle')} message={t('categories.deleteMessage')} confirmText={t('common.delete')} loading={deleting} />
    </div>
  );
}
