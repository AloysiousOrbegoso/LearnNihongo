'use client';

import Link from 'next/link';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export function AuthNavAction() {
  const status = useCurrentUser();
  const signedIn = status === 'signed-in';

  return (
    <Link
      href={signedIn ? '/home' : '/sign-in'}
      className="bg-accent text-accent-foreground rounded-md px-3 py-1.5"
    >
      {signedIn ? 'Dashboard' : 'Sign in'}
    </Link>
  );
}
