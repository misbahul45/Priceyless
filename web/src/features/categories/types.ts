export type Category = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
};

export type CreateCategoryRequest = {
  name: string;
  description?: string;
};

export type UpdateCategoryRequest = {
  name?: string;
  description?: string;
};
