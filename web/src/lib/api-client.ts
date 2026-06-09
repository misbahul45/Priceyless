import { appConfig } from '../config/app.config';
import { getAccessToken, clearAuthSession } from './auth-storage';

export type ApiSuccess<T> = {
  status: 'success';
  message: string;
  data: T;
};

export type ApiError = {
  status: 'error';
  message: string;
  error?: {
    code?: string;
    details?: unknown[];
  };
};

export class ApiClientError extends Error {
  statusCode: number;
  code?: string;
  details?: unknown[];

  constructor(message: string, statusCode: number, code?: string, details?: unknown[]) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getAccessToken();

  const res = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401) {
      clearAuthSession();
    }
    throw new ApiClientError(
      json?.message || 'Request failed',
      res.status,
      json?.error?.code,
      json?.error?.details,
    );
  }

  return json?.data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),
};
