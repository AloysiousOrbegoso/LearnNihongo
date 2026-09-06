'use client';

import { useState } from 'react';
import { SignInForm } from '@/components/features/SignInForm';
import { SignUpForm } from '@/components/features/SignUpForm';
import { ResetPasswordForm } from '@/components/features/ResetPasswordForm';

type Mode = 'sign-in' | 'sign-up' | 'reset';

const TABS: { mode: Mode; label: string }[] = [
  { mode: 'sign-in', label: 'Sign in' },
  { mode: 'sign-up', label: 'Sign up' },
  { mode: 'reset', label: 'Reset' },
];

export function AuthPanel() {
  const [mode, setMode] = useState<Mode>('sign-in');

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="bg-surface-sunken flex gap-1 rounded-full p-1 text-sm">
        {TABS.map((tab) => (
          <button
            key={tab.mode}
            type="button"
            onClick={() => setMode(tab.mode)}
            className={`flex-1 rounded-full px-3 py-1.5 font-semibold transition-colors ${
              mode === tab.mode
                ? 'bg-accent text-accent-foreground'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {mode === 'sign-in' && <SignInForm />}
      {mode === 'sign-up' && <SignUpForm />}
      {mode === 'reset' && <ResetPasswordForm />}
    </div>
  );
}
