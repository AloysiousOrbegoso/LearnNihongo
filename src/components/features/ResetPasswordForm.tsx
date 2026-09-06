'use client';

import { useState } from 'react';
import { useApiAction } from '@/hooks/useApiAction';
import type { ResetPasswordInput } from '@/schemas/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

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
      <Input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email"
        required
      />
      {error && <p className="text-accent text-sm">{error}</p>}
      {message && <p className="text-muted text-sm">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send reset link'}
      </Button>
    </form>
  );
}
