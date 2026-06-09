import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from './api';
import { queryKeys } from '../../lib/query-keys';
import type { CreateProductRequest, UpdateProductRequest } from './types';

export function useProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: productsApi.findAll,
  });
}

export function useProductQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productsApi.findOne(id),
    enabled: !!id,
  });
}

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateProductRequest }) =>
      productsApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(variables.id),
      });
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.all,
      });
    },
  });
}
