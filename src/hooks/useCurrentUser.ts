'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/auth/client';

export type AuthStatus = 'loading' | 'signed-in' | 'signed-out';

export function useCurrentUser(): AuthStatus {
  const [status, setStatus] = useState<AuthStatus>('loading');

  useEffect(() => {
    let active = true;

    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (active) setStatus(data.user ? 'signed-in' : 'signed-out');
      })
      .catch(() => {
        if (active) setStatus('signed-out');
      });

    return () => {
      active = false;
    };
  }, []);

  return status;
}
