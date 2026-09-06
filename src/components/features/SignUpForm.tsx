'use client';

import { useState } from 'react';
import { useApiAction } from '@/hooks/useApiAction';
import type { SignUpInput } from '@/schemas/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const { execute, loading, error } = useApiAction<SignUpInput, { message: string }>(
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
        minLength={8}
      />
      {error && <p className="text-accent text-sm">{error}</p>}
      {message && <p className="text-muted text-sm">{message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
