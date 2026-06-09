import { apiClient } from '../../lib/api-client';
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from './types';

export const categoriesApi = {
  findAll: () => apiClient.get<Category[]>('/v1/categories'),
  findOne: (id: string) => apiClient.get<Category>(`/v1/categories/${id}`),
  create: (payload: CreateCategoryRequest) =>
    apiClient.post<Category>('/v1/categories', payload),
  update: (id: string, payload: UpdateCategoryRequest) =>
    apiClient.patch<Category>(`/v1/categories/${id}`, payload),
  remove: (id: string) => apiClient.delete<{ success: boolean }>(`/v1/categories/${id}`),
};
