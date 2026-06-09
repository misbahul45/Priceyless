import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { AuthLayout } from '../components/layout/AuthLayout';
import { RegisterForm } from '../features/auth/components/RegisterForm';
import { RedirectIfAuthenticated } from '../lib/route-guard';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();

  return (
    <RedirectIfAuthenticated>
      <AuthLayout 
        title="Create an account" 
        subtitle="Enter your information to get started."
      >
        <RegisterForm onSuccess={() => navigate({ to: '/login' })} />
        <p className="mt-6 text-center text-sm text-[#6a6a6a]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#ff385c] hover:underline">
            Sign in
          </Link>
        </p>
      </AuthLayout>
    </RedirectIfAuthenticated>
  );
}
