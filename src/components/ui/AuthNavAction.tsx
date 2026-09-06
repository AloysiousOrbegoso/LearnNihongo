'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import { LinkButton } from '@/components/ui/Button';

export function AuthNavAction() {
  const status = useCurrentUser();
  const signedIn = status === 'signed-in';

  return (
    <LinkButton href={signedIn ? '/home' : '/sign-in'} size="sm">
      {signedIn ? 'Dashboard' : 'Sign in'}
    </LinkButton>
  );
}
