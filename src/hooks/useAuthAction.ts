'use client';

import { useState } from 'react';
import type { ApiResponse } from '@/types/api';

export function useAuthAction<TInput, TData>(endpoint: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(input: TInput): Promise<TData | null> {
    setLoading(true);
    setError(null);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });

    const result: ApiResponse<TData> = await response.json();

    setLoading(false);

    if (!result.ok) {
      setError(result.error.message);
      return null;
    }

    return result.data;
  }

  return { execute, loading, error };
}
