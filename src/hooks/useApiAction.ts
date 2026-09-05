'use client';

import { useState } from 'react';
import type { ApiResponse } from '@/types/api';

type Method = 'POST' | 'PATCH' | 'DELETE';

export function useApiAction<TInput, TData>(endpoint: string, method: Method = 'POST') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function execute(input?: TInput): Promise<TData | null> {
    setLoading(true);
    setError(null);

    let result: ApiResponse<TData>;
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: input === undefined ? undefined : JSON.stringify(input),
      });
      result = await response.json();
    } catch {
      result = { ok: false, error: { code: 'NETWORK', message: 'Could not reach the server.' } };
    }

    setLoading(false);

    if (!result.ok) {
      setError(result.error.message);
      return null;
    }

    return result.data;
  }

  return { execute, loading, error };
}
