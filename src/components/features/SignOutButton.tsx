'use client';

import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';

export function SignOutButton() {
  const router = useRouter();
  const { execute, loading } = useApiAction<undefined, { redirectTo: string }>(
    '/api/auth/sign-out',
  );

  async function handleClick() {
    const result = await execute();
    if (result) {
      router.push(result.redirectTo);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="border-border text-muted hover:text-foreground rounded-md border px-3 py-1.5 disabled:opacity-50"
    >
      {loading ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
