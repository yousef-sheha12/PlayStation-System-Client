'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Plus, Minus, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/layout/page-header';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Search from '@/components/ui/search';
import Modal from '@/components/ui/modal';
import Loader from '@/components/ui/loader';
import { useIncreaseQuantity, useDecreaseQuantity } from '@/hooks/use-inventory';
import { useProducts } from '@/hooks/use-products';
import { formatCurrency } from '@/utils';
import { Product } from '@/types';
import { useTranslation } from '@/hooks/use-translation';

export default function InventoryContent() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [adjustModal, setAdjustModal] = useState<{ product: Product; type: 'increase' | 'decrease' } | null>(null);
  const [adjustQty, setAdjustQty] = useState(1);

  const { data: productsResponse, isLoading } = useProducts({ pageNumber: 1, pageSize: 1000 });
  const products = productsResponse?.data || [];
  const { mutate: increaseQty, isPending: increasing } = useIncreaseQuantity();
  const { mutate: decreaseQty, isPending: decreasing } = useDecreaseQuantity();

const filteredProducts = products.filter((p: Product) => p.name.toLowerCase().includes(search.toLowerCase()) || p.categoryName?.toLowerCase().includes(search.toLowerCase()));
const lowStockCount = products.filter((p: Product) => p.quantity <= 5).length;

  const handleAdjust = () => {
    if (!adjustModal || adjustQty <= 0) return;
    const fn = adjustModal.type === 'increase' ? increaseQty : decreaseQty;
    fn({ productId: adjustModal.product.id, quantity: adjustQty }, { onSuccess: () => { setAdjustModal(null); setAdjustQty(1); } });
  };

  return (
    <div>
      <PageHeader title={t('inventory.title')} subtitle={`${t('inventory.subtitle')} ${lowStockCount > 0 ? `• ${t('inventory.lowStockAlert', { count: lowStockCount })}` : ''}`} />
      {lowStockCount > 0 && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle size={20} className="text-amber-500" />
          <p className="text-amber-700 text-sm font-medium">{t('inventory.lowStockAlert', { count: lowStockCount })}</p>
        </motion.div>
      )}
      <Card hover={false} className="mb-6"><Search placeholder={t('inventory.searchInventory')} onSearch={setSearch} /></Card>
      <Card hover={false} padding={false}>
        {isLoading ? (
          <div className="p-8 text-center"><Loader size="lg" text={t('inventory.loadingInventory')} /></div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center"><Box size={48} className="mx-auto text-gray-300 mb-4" /><p className="text-gray-400">{t('inventory.noInventory')}</p></div>
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
                {filteredProducts.map((product: Product, index: number) => (
                  <motion.tr key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }} className={`hover:bg-blue-50/50 ${product.quantity <= 5 ? 'bg-red-50/30' : ''}`}>
                    <td className="font-semibold text-gray-800">{product.name}</td>
                    <td><Badge variant="secondary">{product.categoryName || t('common.none')}</Badge></td>
                    <td className="font-medium">{formatCurrency(product.price)}</td>
                    <td><span className={`font-bold ${product.quantity <= 5 ? 'text-red-500' : 'text-gray-800'}`}>{product.quantity}</span></td>
                    <td>{product.quantity <= 5 ? <Badge variant="danger">{t('products.lowStock')}</Badge> : product.quantity <= 10 ? <Badge variant="warning">{t('inventory.medium')}</Badge> : <Badge variant="success">{t('products.inStock')}</Badge>}</td>
                    <td><div className="flex justify-end gap-1">
                      <Button variant="success" size="sm" icon={<Plus size={14} />} onClick={() => { setAdjustModal({ product, type: 'increase' }); setAdjustQty(1); }} />
                      <Button variant="danger" size="sm" icon={<Minus size={14} />} onClick={() => { setAdjustModal({ product, type: 'decrease' }); setAdjustQty(1); }} />
                    </div></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <Modal isOpen={!!adjustModal} onClose={() => setAdjustModal(null)} title={`${adjustModal?.type === 'increase' ? t('inventory.increase') : t('inventory.decrease')} - ${adjustModal?.product.name}`} size="sm">
        <div className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text font-medium text-gray-700">{t('inventory.quantityLabel')}</span></label>
            <input type="number" min="1" value={adjustQty} onChange={(e) => setAdjustQty(Number(e.target.value))} className="input input-bordered w-full rounded-xl" />
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setAdjustModal(null)}>{t('common.cancel')}</Button>
            <Button variant={adjustModal?.type === 'increase' ? 'success' : 'danger'} className="flex-1" loading={increasing || decreasing} onClick={handleAdjust}>{adjustModal?.type === 'increase' ? t('inventory.increase') : t('inventory.decrease')}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
