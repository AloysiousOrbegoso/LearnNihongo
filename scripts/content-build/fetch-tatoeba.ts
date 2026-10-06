import { execSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const CACHE_DIR = join(import.meta.dirname, '.cache-tatoeba');

const JPN_SENTENCES_URL =
  'https://downloads.tatoeba.org/exports/per_language/jpn/jpn_sentences.tsv.bz2';
const ENG_SENTENCES_URL =
  'https://downloads.tatoeba.org/exports/per_language/eng/eng_sentences.tsv.bz2';
const INDICES_URL = 'https://downloads.tatoeba.org/exports/jpn_indices.tar.bz2';

export function fetchTatoebaSources() {
  rmSync(CACHE_DIR, { recursive: true, force: true });
  mkdirSync(CACHE_DIR, { recursive: true });

  console.log('Fetching Japanese sentences...');
  execSync(`curl -sL "${JPN_SENTENCES_URL}" -o "${join(CACHE_DIR, 'jpn_sentences.tsv.bz2')}"`, {
    stdio: 'inherit',
  });
  execSync(`bzip2 -d "${join(CACHE_DIR, 'jpn_sentences.tsv.bz2')}"`, { stdio: 'inherit' });

  console.log('Fetching English sentences...');
  execSync(`curl -sL "${ENG_SENTENCES_URL}" -o "${join(CACHE_DIR, 'eng_sentences.tsv.bz2')}"`, {
    stdio: 'inherit',
  });
  execSync(`bzip2 -d "${join(CACHE_DIR, 'eng_sentences.tsv.bz2')}"`, { stdio: 'inherit' });

  console.log('Fetching Japanese sentence indices...');
  const indicesDir = join(CACHE_DIR, 'indices');
  mkdirSync(indicesDir, { recursive: true });
  execSync(`curl -sL "${INDICES_URL}" -o "${join(CACHE_DIR, 'jpn_indices.tar.bz2')}"`, {
    stdio: 'inherit',
  });
  execSync(`tar -xjf "${join(CACHE_DIR, 'jpn_indices.tar.bz2')}" -C "${indicesDir}"`, {
    stdio: 'inherit',
  });
  const indicesFile = readdirSync(indicesDir)[0];
  if (!indicesFile) throw new Error('jpn_indices archive was empty after extraction');

  return {
    jpnSentencesPath: join(CACHE_DIR, 'jpn_sentences.tsv'),
    engSentencesPath: join(CACHE_DIR, 'eng_sentences.tsv'),
    indicesPath: join(indicesDir, indicesFile),
  };
}
