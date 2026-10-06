import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export interface TatoebaExample {
  jp: string;
  en: string;
}

interface Manifest {
  contentVersion: string;
  manifest: Record<string, string>;
}

const dir = join(process.cwd(), 'content', 'tatoeba');
let manifest: Manifest | null | undefined;
const shardCache = new Map<string, Record<string, TatoebaExample[]>>();

function getManifest(): Manifest | null {
  if (manifest === undefined) {
    try {
      manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf-8')) as Manifest;
    } catch {
      manifest = null;
    }
  }
  return manifest;
}

function getShard(shardName: string): Record<string, TatoebaExample[]> {
  let shard = shardCache.get(shardName);
  if (!shard) {
    shard = JSON.parse(readFileSync(join(dir, shardName), 'utf-8')) as Record<
      string,
      TatoebaExample[]
    >;
    shardCache.set(shardName, shard);
  }
  return shard;
}

export function getExamples(id: string): TatoebaExample[] {
  const m = getManifest();
  if (!m) return [];
  const shardName = m.manifest[id];
  if (!shardName) return [];
  return getShard(shardName)[id] ?? [];
}
