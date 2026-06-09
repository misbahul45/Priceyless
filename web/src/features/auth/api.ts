import { apiClient } from '../../lib/api-client';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from './types';

export const authApi = {
  register: (payload: RegisterRequest) =>
    apiClient.post<User>('/v1/auth/register', payload),
  login: (payload: LoginRequest) =>
    apiClient.post<LoginResponse>('/v1/auth/login', payload),
  me: () => apiClient.get<User>('/v1/auth/me'),
};
