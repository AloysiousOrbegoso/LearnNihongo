import { readFileSync } from 'node:fs';
import { join } from 'node:path';

interface Manifest {
  contentVersion: string;
  manifest: Record<string, string>;
}

export function createReader<T>(dirName: string) {
  const dir = join(process.cwd(), 'content', dirName);
  let manifest: Manifest | null = null;
  const shardCache = new Map<string, Record<string, T>>();

  function getManifest(): Manifest {
    if (!manifest) {
      manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf-8')) as Manifest;
    }
    return manifest;
  }

  function getShard(shardName: string): Record<string, T> {
    let shard = shardCache.get(shardName);
    if (!shard) {
      shard = JSON.parse(readFileSync(join(dir, shardName), 'utf-8')) as Record<string, T>;
      shardCache.set(shardName, shard);
    }
    return shard;
  }

  return {
    getAllIds(): string[] {
      return Object.keys(getManifest().manifest);
    },
    getEntry(id: string): T | null {
      const shardName = getManifest().manifest[id];
      if (!shardName) return null;
      return getShard(shardName)[id] ?? null;
    },
    getContentVersion(): string {
      return getManifest().contentVersion;
    },
  };
}
