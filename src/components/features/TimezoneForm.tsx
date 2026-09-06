'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { useApiAction } from '@/hooks/useApiAction';
import type { UpdateProfileInput } from '@/schemas/profile';
import { Button } from '@/components/ui/Button';

const subscribe = () => () => {};

export function TimezoneForm({ current }: { current: string }) {
  const router = useRouter();
  const [timezone, setTimezone] = useState(current);
  const [saved, setSaved] = useState(false);
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const { execute, loading, error } = useApiAction<UpdateProfileInput, { timezone: string }>(
    '/api/profile',
    'PATCH',
  );

  const zones = useMemo(() => {
    if (!isClient) return [current];
    const supported = Intl.supportedValuesOf('timeZone');
    return supported.includes(current) ? supported : [current, ...supported];
  }, [isClient, current]);

  const browserZone = isClient ? Intl.DateTimeFormat().resolvedOptions().timeZone : null;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaved(false);
    const result = await execute({ timezone });
    if (result) {
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="text-muted">Timezone</span>
        <select
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
          className="border-border bg-surface text-foreground rounded-lg border px-3.5 py-2.5"
        >
          {zones.map((zone) => (
            <option key={zone} value={zone}>
              {zone}
            </option>
          ))}
        </select>
      </label>
      {browserZone && browserZone !== timezone && (
        <button
          type="button"
          onClick={() => setTimezone(browserZone)}
          className="text-accent self-start text-sm underline"
        >
          Use my browser&apos;s timezone ({browserZone})
        </button>
      )}
      <div className="flex items-center gap-3">
        <Button type="submit" disabled={loading || timezone === current}>
          {loading ? 'Saving…' : 'Save'}
        </Button>
        {saved && <span className="text-muted text-sm">Saved.</span>}
        {error && <span className="text-accent text-sm">{error}</span>}
      </div>
    </form>
  );
}
