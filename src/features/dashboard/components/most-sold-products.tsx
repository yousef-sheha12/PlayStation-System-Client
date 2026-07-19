'use client';

import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import Card from '@/components/ui/card';
import { MostSoldProduct } from '@/types';
import { formatCurrency } from '@/utils';
import { useTranslation } from '@/hooks/use-translation';

interface MostSoldProductsProps {
  products: MostSoldProduct[];
}

export default function MostSoldProducts({ products }: MostSoldProductsProps) {
  const { t } = useTranslation();
  const maxQty = Math.max(...products.map((p) => p.totalQuantity), 1);

  return (
    <Card hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-800">{t('dashboard.mostSoldProducts')}</h3>
      </div>
      <div className="space-y-3">
        {products.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">{t('common.none')}</p>
        ) : (
          products.map((product, index) => (
            <motion.div key={product.productName} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">{product.productName}</span>
                  <span className="text-xs text-gray-500">{product.totalQuantity}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(product.totalQuantity / maxQty) * 100}%` }} transition={{ duration: 0.8, delay: index * 0.1 }} className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-full" />
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-800 min-w-[80px] text-right">{formatCurrency(product.totalRevenue)}</span>
            </motion.div>
          ))
        )}
      </div>
    </Card>
  );
}
