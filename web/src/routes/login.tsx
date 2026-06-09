import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { AuthLayout } from '../components/layout/AuthLayout';
import { LoginForm } from '../features/auth/components/LoginForm';
import { RedirectIfAuthenticated } from '../lib/route-guard';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <RedirectIfAuthenticated>
      <AuthLayout 
        title="Welcome back" 
        subtitle="Please enter your details to sign in."
      >
        <LoginForm onSuccess={() => navigate({ to: '/dashboard' })} />
        <p className="mt-6 text-center text-sm text-[#6a6a6a]">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-[#ff385c] hover:underline">
            Sign up
          </Link>
        </p>
      </AuthLayout>
    </RedirectIfAuthenticated>
  );
}
