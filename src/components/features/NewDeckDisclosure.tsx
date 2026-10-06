'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

// Keeps CreateDeckForm's own internals untouched -- this only toggles
// whether it's visible, so someone with a dozen decks isn't shown an empty
// input every time they just want to open a deck.
export function NewDeckDisclosure({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button type="button" size="lg" onClick={() => setOpen(true)} className="flex-shrink-0">
        New deck
      </Button>
    );
  }

  return (
    <div className="border-border bg-surface w-full rounded-lg border p-4 sm:w-auto sm:min-w-80">
      {children}
    </div>
  );
}
