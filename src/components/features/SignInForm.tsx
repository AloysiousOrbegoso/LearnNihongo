'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthAction } from '@/hooks/useAuthAction';
import type { SignInInput } from '@/schemas/auth';

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { execute, loading, error } = useAuthAction<SignInInput, { redirectTo: string }>(
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
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        required
        className="border-border bg-surface text-foreground rounded-md border px-3 py-2"
      />
      <input
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        required
        className="border-border bg-surface text-foreground rounded-md border px-3 py-2"
      />
      {error && <p className="text-accent text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-accent-foreground rounded-md px-4 py-2 disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
