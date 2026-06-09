import type { Category } from '../categories/types';

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  categoryId: string;
  category?: Category;
  createdAt: string;
  updatedAt: string;
};

export type CreateProductRequest = {
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: string;
};

export type UpdateProductRequest = {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
};
