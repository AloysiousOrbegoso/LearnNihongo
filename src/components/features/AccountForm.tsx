'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';
import { AVATAR_OPTIONS } from '@/schemas/profile';
import type { AvatarOption, UpdateProfileInput } from '@/schemas/profile';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function asAvatarOption(value: string | null): AvatarOption | null {
  return (AVATAR_OPTIONS as readonly string[]).includes(value ?? '')
    ? (value as AvatarOption)
    : null;
}

export function AccountForm({
  currentName,
  currentAvatar,
}: {
  currentName: string | null;
  currentAvatar: string | null;
}) {
  const router = useRouter();
  const initialAvatar = asAvatarOption(currentAvatar);
  const [name, setName] = useState(currentName ?? '');
  const [avatar, setAvatar] = useState<AvatarOption | null>(initialAvatar);
  const [saved, setSaved] = useState(false);
  const { execute, loading, error } = useApiAction<
    UpdateProfileInput,
    { displayName: string | null; avatar: string | null }
  >('/api/profile', 'PATCH');

  const trimmedName = name.trim();
  const unchanged = trimmedName === (currentName ?? '') && avatar === initialAvatar;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(false);
    const result = await execute({
      displayName: trimmedName.length > 0 ? trimmedName : null,
      avatar,
    });
    if (result) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Display name</span>
        <Input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={40}
          placeholder="Your name"
        />
      </label>

      <div className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Avatar</span>
        <div className="flex flex-wrap gap-2">
          {AVATAR_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAvatar(option === avatar ? null : option)}
              aria-pressed={option === avatar}
              className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition-colors ${
                option === avatar
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-surface hover:bg-surface-sunken'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading || unchanged}>
          {loading ? 'Saving…' : 'Save'}
        </Button>
        {saved && <span className="text-muted text-sm">Saved.</span>}
        {error && <span className="text-accent text-sm">{error}</span>}
      </div>
    </form>
  );
}
