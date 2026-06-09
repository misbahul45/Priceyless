import { Navigate, Outlet } from '@tanstack/react-router';
import { getAccessToken, getStoredUser } from './auth-storage';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const token = getAccessToken();
  const user = getStoredUser();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

export function AuthLayoutRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function DashboardLayoutRoute({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}

export function AdminLayoutRoute({ children }: { children: React.ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>;
}