import { createFileRoute, Navigate } from '@tanstack/react-router';
import { getAccessToken } from '../lib/auth-storage';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const token = getAccessToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Navigate to="/login" replace />;
}
