import React, { useState } from 'react';
import { useRegisterMutation } from '../hooks';
import { useToast } from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';

export function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const registerMutation = useRegisterMutation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(
      { name, email, password },
      {
        onSuccess: () => {
          toast('Registration successful. Please log in.', 'success');
          onSuccess();
        },
        onError: (error: any) => {
          toast(error.message || 'Failed to register', 'error');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1">Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="John Doe"
          disabled={registerMutation.isPending}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1">Email</label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="user@example.com"
          disabled={registerMutation.isPending}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#222222] mb-1">Password</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          disabled={registerMutation.isPending}
        />
      </div>
      <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
        {registerMutation.isPending ? 'Registering...' : 'Create Account'}
      </Button>
    </form>
  );
}
