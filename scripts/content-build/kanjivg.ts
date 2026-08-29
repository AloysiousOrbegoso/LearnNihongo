import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { writeShards } from './shard.ts';

export interface Stroke {
  d: string;
  type: string | null;
  order: number;
}

export interface KanjiVgEntry {
  strokeCount: number;
  strokes: Stroke[];
}

function literalToCodepointHex(literal: string): string {
  const codepoint = literal.codePointAt(0);
  if (codepoint === undefined) throw new Error(`Invalid literal: ${literal}`);
  return codepoint.toString(16).padStart(5, '0');
}

function parseStrokes(svg: string): Stroke[] {
  const pathRegex = /<path\b([^>]*)\/?>/g;
  const strokes: Stroke[] = [];
  let match: RegExpExecArray | null;
  let order = 1;
  while ((match = pathRegex.exec(svg)) !== null) {
    const attrs = match[1];
    const dMatch = attrs.match(/\bd="([^"]*)"/);
    if (!dMatch) continue;
    const typeMatch = attrs.match(/kvg:type="([^"]*)"/);
    strokes.push({ d: dMatch[1], type: typeMatch ? typeMatch[1] : null, order: order++ });
  }
  return strokes;
}

export function buildKanjiVg(kanjivgDir: string, literals: Set<string>, outDir: string) {
  const entries: { id: string; data: KanjiVgEntry }[] = [];
  const missing: string[] = [];

  for (const literal of literals) {
    const hex = literalToCodepointHex(literal);
    const filePath = join(kanjivgDir, `${hex}.svg`);
    try {
      const svg = readFileSync(filePath, 'utf-8');
      const strokes = parseStrokes(svg);
      entries.push({ id: literal, data: { strokeCount: strokes.length, strokes } });
    } catch {
      missing.push(literal);
    }
  }

  const count = writeShards(outDir, entries, 'kanjivg-r20250816');
  return { count, missing };
}
