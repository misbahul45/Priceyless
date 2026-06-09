import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from './api';
import { clearAuthSession, getAccessToken, setAuthSession } from '../../lib/auth-storage';
import { queryKeys } from '../../lib/query-keys';

export function useMeQuery() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: authApi.me,
    enabled: !!getAccessToken(),
    retry: false,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuthSession(data.accessToken, data.user);
      queryClient.setQueryData(queryKeys.auth.me, data.user);
    },
  });
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: authApi.register,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearAuthSession();
    queryClient.clear();
  };
}
