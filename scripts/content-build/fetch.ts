import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CACHE_DIR = join(import.meta.dirname, '.cache');

const JMDICT_URL =
  'https://github.com/scriptin/jmdict-simplified/releases/download/3.6.2%2B20260824122934/jmdict-eng-common-3.6.2+20260824122934.json.tgz';
const KANJIDIC_URL =
  'https://github.com/scriptin/jmdict-simplified/releases/download/3.6.2%2B20260824122934/kanjidic2-en-3.6.2+20260824122934.json.tgz';
const KANJIVG_REPO = 'https://github.com/KanjiVG/kanjivg';

function findFile(dir: string, pattern: RegExp): string {
  const match = readdirSync(dir).find((f) => pattern.test(f));
  if (!match) throw new Error(`No file matching ${pattern} in ${dir}`);
  return join(dir, match);
}

export function fetchSources() {
  rmSync(CACHE_DIR, { recursive: true, force: true });
  mkdirSync(CACHE_DIR, { recursive: true });

  console.log('Fetching jmdict-eng-common...');
  execSync(`curl -sL "${JMDICT_URL}" -o "${join(CACHE_DIR, 'jmdict.tgz')}"`, { stdio: 'inherit' });
  execSync(`tar -xzf "${join(CACHE_DIR, 'jmdict.tgz')}" -C "${CACHE_DIR}"`, { stdio: 'inherit' });

  console.log('Fetching kanjidic2-en...');
  execSync(`curl -sL "${KANJIDIC_URL}" -o "${join(CACHE_DIR, 'kanjidic.tgz')}"`, {
    stdio: 'inherit',
  });
  execSync(`tar -xzf "${join(CACHE_DIR, 'kanjidic.tgz')}" -C "${CACHE_DIR}"`, {
    stdio: 'inherit',
  });

  console.log('Cloning KanjiVG...');
  execSync(`git clone --depth 1 "${KANJIVG_REPO}" "${join(CACHE_DIR, 'kanjivg')}"`, {
    stdio: 'inherit',
  });

  return {
    jmdictRaw: findFile(CACHE_DIR, /^jmdict-eng-common.*\.json$/),
    kanjidicRaw: findFile(CACHE_DIR, /^kanjidic2-en.*\.json$/),
    kanjivgDir: join(CACHE_DIR, 'kanjivg', 'kanji'),
  };
}
