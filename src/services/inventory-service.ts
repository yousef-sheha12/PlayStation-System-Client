import api from '@/lib/axios';

export interface ProductStockAlert {
  id: number;
  name: string;
  quantity: number;
  lowStockThreshold: number;
  categoryName: string;
}

export const inventoryService = {
  getLowStock: async (): Promise<ProductStockAlert[]> => {
    const response = await api.get<ProductStockAlert[]>('/inventory/low-stock');
    return response.data;
  },

  getOutOfStock: async (): Promise<ProductStockAlert[]> => {
    const response = await api.get<ProductStockAlert[]>('/inventory/out-of-stock');
    return response.data;
  },

  increaseQuantity: async (productId: number, quantity: number) => {
    const response = await api.post<void>(`/inventory/${productId}/increase`, { quantity });
    return response.data;
  },

  decreaseQuantity: async (productId: number, quantity: number) => {
    const response = await api.post<void>(`/inventory/${productId}/decrease`, { quantity });
    return response.data;
  },
};
