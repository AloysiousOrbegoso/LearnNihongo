'use client';

import { useState } from 'react';
import { useApiAction } from '@/hooks/useApiAction';
import type { ResetPasswordInput } from '@/schemas/auth';

export function ResetPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const { execute, loading, error } = useApiAction<ResetPasswordInput, { message: string }>(
    '/api/auth/reset-password',
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const result = await execute({ email });
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
      {error && <p className="text-accent text-sm">{error}</p>}
      {message && <p className="text-muted text-sm">{message}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-accent text-accent-foreground rounded-md px-4 py-2 disabled:opacity-50"
      >
        {loading ? 'Sending…' : 'Send reset link'}
      </button>
    </form>
  );
}
