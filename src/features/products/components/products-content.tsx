'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Package, Search, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/layout/page-header';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import Pagination from '@/components/ui/pagination';
import Loader from '@/components/ui/loader';
import ProductForm from './product-form';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/use-products';
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
  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();

  const handleAdd = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: import('@/features/products/types').ProductFormData) => {
    if (editingProduct) {
      updateProduct(
        { id: editingProduct.id, data: formData },
        { onSuccess: () => { setFormOpen(false); setEditingProduct(null); } }
      );
    } else {
      createProduct(formData, { onSuccess: () => setFormOpen(false) });
    }
  };

  const handleDelete = () => {
    if (deleteId) deleteProduct(deleteId, { onSuccess: () => setDeleteId(null) });
  };

  const products = data?.items || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('products.title')}
        subtitle={t('products.subtitle')}
        actions={
          <Button icon={<Plus size={18} />} onClick={handleAdd} size="lg">
            {t('products.addProduct')}
          </Button>
        }
      />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder={t('products.searchProducts')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader size="lg" text={t('products.loadingProducts')} />
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-16 text-center"
        >
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t('products.noProducts')}</h3>
          <p className="text-gray-400 mb-6">{t('products.noProducts')}</p>
          <Button icon={<Plus size={18} />} onClick={handleAdd}>
            {t('products.addProduct')}
          </Button>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <AnimatePresence>
              {products.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(59, 130, 246, 0.12)' }}
                  className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/30 overflow-hidden group"
                >
                  <div className="relative h-36 bg-gradient-to-br from-blue-400/10 via-sky-400/10 to-indigo-400/10 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/60 rounded-2xl flex items-center justify-center shadow-sm">
                      <Package size={32} className="text-blue-500" />
                    </div>
                    {product.quantity <= (product.lowStockThreshold || 5) && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                        <AlertTriangle size={12} />
                        {t('products.lowStock')}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{product.name}</h3>
                    {product.description && (
                      <p className="text-sm text-gray-400 mb-3 truncate">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-extrabold text-blue-600">{formatCurrency(product.price)}</span>
                      <Badge variant={product.quantity > 5 ? 'success' : 'danger'}>
                        {t('products.quantity')}: {product.quantity}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        icon={<Edit3 size={14} />}
                        onClick={() => handleEdit(product)}
                      >
                        {t('common.edit')}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="flex-1"
                        icon={<Trash2 size={14} />}
                        onClick={() => setDeleteId(product.id)}
                      >
                        {t('common.delete')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center pt-4">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      <ProductForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingProduct(null); }}
        product={editingProduct}
        onSubmit={handleFormSubmit}
        isLoading={creating || updating}
      />
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('products.deleteTitle')}
        message={t('products.deleteMessage')}
        confirmText={t('common.delete')}
        loading={deleting}
      />
    </div>
  );
}
