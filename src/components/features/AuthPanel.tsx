'use client';

import { useState } from 'react';
import { SignInForm } from '@/components/features/SignInForm';
import { SignUpForm } from '@/components/features/SignUpForm';
import { ResetPasswordForm } from '@/components/features/ResetPasswordForm';

type Mode = 'sign-in' | 'sign-up' | 'reset';

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>('sign-in');

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex gap-4 text-sm">
        <button
          type="button"
          onClick={() => setMode('sign-in')}
          className={mode === 'sign-in' ? 'text-foreground font-semibold' : 'text-muted'}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode('sign-up')}
          className={mode === 'sign-up' ? 'text-foreground font-semibold' : 'text-muted'}
        >
          Create account
        </button>
        <button
          type="button"
          onClick={() => setMode('reset')}
          className={mode === 'reset' ? 'text-foreground font-semibold' : 'text-muted'}
        >
          Forgot password
        </button>
      </div>
      {mode === 'sign-in' && <SignInForm />}
      {mode === 'sign-up' && <SignUpForm />}
      {mode === 'reset' && <ResetPasswordForm />}
    </div>
  );
}
