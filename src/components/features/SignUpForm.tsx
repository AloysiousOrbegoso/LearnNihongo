'use client';

import { useState } from 'react';
import { useAuthAction } from '@/hooks/useAuthAction';
import type { SignUpInput } from '@/schemas/auth';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const { execute, loading, error } = useAuthAction<SignUpInput, { message: string }>(
    '/api/auth/sign-up',
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await execute({ email, password });
    if (result) {
      setMessage(result.message);
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
        minLength={8}
        className="border-border bg-surface text-foreground rounded-md border px-3 py-2"
      />
      {error && <p className="text-accent text-sm">{error}</p>}
      {message && <p className="text-muted text-sm">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-accent-foreground rounded-md px-4 py-2 disabled:opacity-50"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  );
}
