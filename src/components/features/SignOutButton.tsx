'use client';

import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';
import { Button } from '@/components/ui/Button';

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
    <Button type="button" variant="ghost" size="sm" onClick={handleClick} disabled={loading}>
      {loading ? 'Signing out…' : 'Sign out'}
    </Button>
  );
}
