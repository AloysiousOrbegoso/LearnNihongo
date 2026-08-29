import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

// Supabase's transaction-mode pooler (port 6543) doesn't support prepared
// statements — a query can land on a different backend connection each
// time, and postgres-js's default statement caching breaks against that.
const globalForDb = globalThis as unknown as { client?: ReturnType<typeof postgres> };

const client = globalForDb.client ?? postgres(connectionString, { prepare: false });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.client = client;
}

export const db = drizzle(client, { schema });
