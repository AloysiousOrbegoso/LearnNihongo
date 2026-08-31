import { fileURLToPath } from 'node:url';
import { fetchSources } from './fetch.ts';
import { buildJmdict } from './jmdict.ts';
import { buildKanjidic } from './kanjidic.ts';
import { buildKanjiVg } from './kanjivg.ts';
import { buildSearchIndices } from './search-index.ts';

const OUT_DIR = fileURLToPath(new URL('../../content/', import.meta.url));

const sources = fetchSources();

const jmdictResult = buildJmdict(sources.jmdictRaw, `${OUT_DIR}jmdict`);
console.log(`jmdict: ${jmdictResult.count} entries, version ${jmdictResult.version}`);

const kanjidicResult = buildKanjidic(sources.kanjidicRaw, `${OUT_DIR}kanjidic`);
console.log(`kanjidic: ${kanjidicResult.count} entries, version ${kanjidicResult.version}`);

const kanjivgResult = buildKanjiVg(
  sources.kanjivgDir,
  kanjidicResult.literals,
  `${OUT_DIR}kanjivg`,
);
console.log(`kanjivg: ${kanjivgResult.count} entries, ${kanjivgResult.missing.length} missing`);
if (kanjivgResult.missing.length > 0) {
  console.log('missing literals:', kanjivgResult.missing.join(' '));
}

const searchResult = buildSearchIndices(
  `${OUT_DIR}jmdict`,
  `${OUT_DIR}kanjidic`,
  `${OUT_DIR}search`,
);
console.log(
  `search index: ${searchResult.vocabCount} vocab entries, ${searchResult.kanjiCount} kanji entries`,
);
