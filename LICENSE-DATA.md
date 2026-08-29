# Data licensing

This file covers the licensing of the **dictionary and kanji data** used by
this app, under `content/`. It is separate from the license covering the
application's own source code.

Per the terms below, the underlying datasets are redistributed here in
processed (sharded JSON) form, as permitted and required by their
share-alike licenses. Share-alike applies to the data files only — this
project's own components, route handlers, and queries remain under this
repository's own code license.

---

## JMdict (via jmdict-simplified)

- **Source**: [JMdict](https://www.edrdg.org/jmdict/j_jmdict.html), a
  Japanese-multilingual dictionary maintained by the Electronic Dictionary
  Research and Development Group (EDRDG).
- **Distribution used**: [jmdict-simplified](https://github.com/scriptin/jmdict-simplified)
  (`jmdict-eng-common`), a JSON conversion of the original XML, filtered to
  commonly-used entries.
- **License**: [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- **License terms (EDRDG)**: https://www.edrdg.org/edrdg/licence.html
- **Modified**: Yes. Entries were filtered to the common-words subset,
  re-shaped into a simplified schema, and split into ID-range shards for
  this app's runtime lookups.

## KANJIDIC2 (via jmdict-simplified)

- **Source**: [KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project),
  a kanji database maintained by EDRDG.
- **Distribution used**: [jmdict-simplified](https://github.com/scriptin/jmdict-simplified)
  (`kanjidic2-en`), a JSON conversion of the original XML.
- **License**: [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- **License terms (EDRDG)**: https://www.edrdg.org/edrdg/licence.html
- **Modified**: Yes. Filtered to jōyō kanji (grade 1–8, 2,136 characters),
  re-shaped into a simplified schema, and split into shards.

## KanjiVG

- **Source**: [KanjiVG](https://kanjivg.tagaini.net/), stroke order data
  created by Ulrich Apel.
- **License**: [Creative Commons Attribution-ShareAlike 3.0](https://creativecommons.org/licenses/by-sa/3.0/)
- **License terms**: https://github.com/KanjiVG/kanjivg/blob/master/COPYING
- **Modified**: Yes. Stroke path data was extracted from the original SVG
  files into structured JSON (`{ d, type, order }` per stroke) for this
  app's own `<path>`-based rendering, and limited to the same jōyō subset
  as KANJIDIC2 above.

---

Both EDRDG datasets (JMdict, KANJIDIC2) are acknowledged here by name, per
their license terms, as the **Electronic Dictionary Research and
Development Group** — see the `/attributions` page (linked from every
page's footer) for the same information in-app.

Processed files remain downloadable in this repository's public `content/`
directory, satisfying the share-alike redistribution requirement directly.
