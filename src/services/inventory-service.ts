import api from '@/lib/axios';
import { ApiResponse } from '@/types';

export interface ProductStockAlert {
  id: number;
  name: string;
  quantity: number;
  lowStockThreshold: number;
  categoryName: string;
}

export const inventoryService = {
  getLowStock: async () => {
    const response = await api.get<ApiResponse<ProductStockAlert[]>>('/inventory/low-stock');
    return response.data;
  },

  getOutOfStock: async () => {
    const response = await api.get<ApiResponse<ProductStockAlert[]>>('/inventory/out-of-stock');
    return response.data;
  },

  increaseQuantity: async (productId: number, quantity: number) => {
    const response = await api.post<ApiResponse<void>>(`/inventory/${productId}/increase`, { quantity });
    return response.data;
  },

  decreaseQuantity: async (productId: number, quantity: number) => {
    const response = await api.post<ApiResponse<void>>(`/inventory/${productId}/decrease`, { quantity });
    return response.data;
  },
};
