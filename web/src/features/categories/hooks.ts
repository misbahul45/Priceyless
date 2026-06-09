import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from './api';
import { queryKeys } from '../../lib/query-keys';
import type { CreateCategoryRequest, UpdateCategoryRequest } from './types';

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: categoriesApi.findAll,
  });
}

export function useCategoryQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: () => categoriesApi.findOne(id),
    enabled: !!id,
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
    },
  });
}

export function useUpdateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryRequest }) =>
      categoriesApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.detail(variables.id),
      });
    },
  });
}

export function useDeleteCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoriesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.categories.all,
      });
    },
  });
}
