import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SHARD_SIZE = 1000;

export function writeShards<T>(
  outDir: string,
  entries: { id: string; data: T }[],
  contentVersion: string,
) {
  mkdirSync(outDir, { recursive: true });
  const sorted = [...entries].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const manifest: Record<string, string> = {};

  for (let i = 0; i < sorted.length; i += SHARD_SIZE) {
    const chunk = sorted.slice(i, i + SHARD_SIZE);
    const shardName = `shard-${String(i / SHARD_SIZE).padStart(4, '0')}.json`;
    const shardData: Record<string, T> = {};
    for (const entry of chunk) {
      shardData[entry.id] = entry.data;
      manifest[entry.id] = shardName;
    }
    writeFileSync(join(outDir, shardName), JSON.stringify(shardData));
  }

  writeFileSync(join(outDir, 'manifest.json'), JSON.stringify({ contentVersion, manifest }));

  return sorted.length;
}
