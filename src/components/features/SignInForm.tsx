'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';
import type { SignInInput } from '@/schemas/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { execute, loading, error } = useApiAction<SignInInput, { redirectTo: string }>(
    '/api/auth/sign-in',
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await execute({ email, password });
    if (result) {
      router.push(result.redirectTo);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-3">
      <Input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        required
      />
      <Input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        required
      />
      {error && <p className="text-accent text-sm">{error}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
