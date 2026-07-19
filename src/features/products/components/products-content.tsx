'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2, Package } from 'lucide-react';
import PageHeader from '@/components/layout/page-header';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Search from '@/components/ui/search';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import Pagination from '@/components/ui/pagination';
import Loader from '@/components/ui/loader';
import ProductForm from './product-form';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/use-products';
import { useCategories } from '@/hooks/use-categories';
import { formatCurrency } from '@/utils';
import { Product } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

export default function ProductsContent() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useProducts({ pageNumber: page, pageSize: 10, searchTerm: search });
  const { data: categories = [] } = useCategories();
  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();

  const handleEdit = (product: Product) => { setEditingProduct(product); setFormOpen(true); };
  const handleFormSubmit = (formData: import('@/features/products/types').ProductFormData) => {
    if (editingProduct) {
      updateProduct({ id: editingProduct.id, data: formData }, { onSuccess: () => { setFormOpen(false); setEditingProduct(null); } });
    } else {
      createProduct(formData, { onSuccess: () => setFormOpen(false) });
    }
  };
  const handleDelete = () => { if (deleteId) deleteProduct(deleteId, { onSuccess: () => setDeleteId(null) }); };

  const products = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div>
      <PageHeader title={t('products.title')} subtitle={t('products.subtitle')} actions={<Button icon={<Plus size={16} />} onClick={() => { setEditingProduct(null); setFormOpen(true); }}>{t('products.addProduct')}</Button>} />
      <Card hover={false} className="mb-6"><Search placeholder={t('products.searchProducts')} onSearch={setSearch} /></Card>
      <Card hover={false} padding={false}>
        {isLoading ? (
          <div className="p-8 text-center"><Loader size="lg" text={t('products.loadingProducts')} /></div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center"><Package size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-400">{t('products.noProducts')}</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr className="bg-gray-50">
                <th className="text-gray-600">{t('products.product')}</th>
                <th className="text-gray-600">{t('products.category')}</th>
                <th className="text-gray-600">{t('products.price')}</th>
                <th className="text-gray-600">{t('products.quantity')}</th>
                <th className="text-gray-600">{t('products.status')}</th>
                <th className="text-gray-600 text-right">{t('common.actions')}</th>
              </tr></thead>
              <tbody>
                {products.map((product: Product, index: number) => (
                  <motion.tr key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="hover:bg-blue-50/50">
                    <td><div className="font-semibold text-gray-800">{product.name}</div></td>
                    <td><Badge variant="secondary">{product.categoryName || t('common.none')}</Badge></td>
                    <td className="font-medium">{formatCurrency(product.price)}</td>
                    <td>{product.quantity}</td>
                    <td>{product.quantity <= 5 ? <Badge variant="danger">{t('products.lowStock')}</Badge> : <Badge variant="success">{t('products.inStock')}</Badge>}</td>
                    <td><div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" icon={<Edit3 size={14} />} onClick={() => handleEdit(product)} />
                      <Button variant="ghost" size="sm" icon={<Trash2 size={14} className="text-red-500" />} onClick={() => setDeleteId(product.id)} />
                    </div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {totalPages > 1 && <div className="flex justify-center p-4 border-t border-gray-100"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} /></div>}
      </Card>
      <ProductForm isOpen={formOpen} onClose={() => { setFormOpen(false); setEditingProduct(null); }} product={editingProduct} categories={categories} onSubmit={handleFormSubmit} isLoading={creating || updating} />
      <ConfirmDialog isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title={t('products.deleteTitle')} message={t('products.deleteMessage')} confirmText={t('common.delete')} loading={deleting} />
    </div>
  );
}
