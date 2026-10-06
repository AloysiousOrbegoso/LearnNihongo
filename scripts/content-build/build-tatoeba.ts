import { fileURLToPath } from 'node:url';
import { fetchTatoebaSources } from './fetch-tatoeba.ts';
import { buildTatoeba } from './tatoeba.ts';

const JMDICT_DIR = fileURLToPath(new URL('../../content/jmdict', import.meta.url));
const OUT_DIR = fileURLToPath(new URL('../../content/tatoeba', import.meta.url));

const sources = fetchTatoebaSources();
const result = buildTatoeba(
  JMDICT_DIR,
  sources.jpnSentencesPath,
  sources.engSentencesPath,
  sources.indicesPath,
  OUT_DIR,
);
console.log(`tatoeba: ${result.count} entries with example sentences`);
