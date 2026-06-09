import { apiClient } from '../../lib/api-client';
import type { Product, CreateProductRequest, UpdateProductRequest } from './types';

export const productsApi = {
  findAll: () => apiClient.get<Product[]>('/v1/products'),
  findOne: (id: string) => apiClient.get<Product>(`/v1/products/${id}`),
  create: (payload: CreateProductRequest) => apiClient.post<Product>('/v1/products', payload),
  update: (id: string, payload: UpdateProductRequest) =>
    apiClient.patch<Product>(`/v1/products/${id}`, payload),
  remove: (id: string) => apiClient.delete<{ success: boolean }>(`/v1/products/${id}`),
};
