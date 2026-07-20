'use client';

import { useState } from 'react';
import Modal from '@/components/ui/modal';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { useTranslation } from '@/hooks/use-translation';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/product-service';
import { useAddSessionProduct } from '@/hooks/use-sessions';
import { formatCurrency } from '@/utils';
import { Product } from '@/types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: number;
}

export default function AddProductModal({ isOpen, onClose, sessionId }: AddProductModalProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { mutate: addProduct, isPending } = useAddSessionProduct();

  const { data: productsData } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => productService.getAll(),
  });

  const products = (productsData || []).filter((p: Product) =>
    p.name.toLowerCase().includes(search.toLowerCase()) && p.quantity > 0
  );

  const handleAdd = () => {
    if (!selectedProduct) return;
    addProduct(
      { sessionId, data: { productId: selectedProduct.id, quantity } },
      {
        onSuccess: () => {
          setSelectedProduct(null);
          setQuantity(1);
          setSearch('');
          onClose();
        },
      }
    );
  };

  const handleClose = () => {
    setSelectedProduct(null);
    setQuantity(1);
    setSearch('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={t('devices.addProduct')} size="md">
      <div className="space-y-4">
        <Input
          placeholder={t('products.searchProducts')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {!selectedProduct ? (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {products.length === 0 ? (
              <p className="text-gray-400 text-center py-4">{t('products.noProducts')}</p>
            ) : (
              products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                >
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                  </div>
                  <span className="text-xs text-gray-400">{t('products.quantity')}: {product.quantity}</span>
                </button>
              ))
            )}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-semibold text-gray-800">{selectedProduct.name}</p>
                <p className="text-sm text-gray-500">{formatCurrency(selectedProduct.price)}</p>
              </div>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-gray-600">
                {t('common.close')}
              </button>
            </div>
            <Input
              label={t('products.quantity')}
              type="number"
              min={1}
              max={selectedProduct.quantity}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <div className="flex justify-between mt-3 text-sm">
              <span className="text-gray-500">Total:</span>
              <span className="font-bold text-green-600">{formatCurrency(selectedProduct.price * quantity)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="ghost" className="flex-1" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="success"
            className="flex-1"
            loading={isPending}
            onClick={handleAdd}
            disabled={!selectedProduct}
          >
            {t('common.add')}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
