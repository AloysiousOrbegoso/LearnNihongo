import type { Metadata } from 'next';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Attributions',
};

const DATASETS = [
  {
    name: 'JMdict',
    org: 'Electronic Dictionary Research and Development Group (EDRDG)',
    sourceHref: 'https://www.edrdg.org/jmdict/j_jmdict.html',
    licenseName: 'Creative Commons Attribution-ShareAlike 4.0',
    licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
    edrdgLicenseHref: 'https://www.edrdg.org/edrdg/licence.html',
  },
  {
    name: 'KANJIDIC2',
    org: 'Electronic Dictionary Research and Development Group (EDRDG)',
    sourceHref: 'https://www.edrdg.org/wiki/index.php/KANJIDIC_Project',
    licenseName: 'Creative Commons Attribution-ShareAlike 4.0',
    licenseHref: 'https://creativecommons.org/licenses/by-sa/4.0/',
    edrdgLicenseHref: 'https://www.edrdg.org/edrdg/licence.html',
  },
  {
    name: 'KanjiVG',
    org: 'Ulrich Apel',
    sourceHref: 'https://kanjivg.tagaini.net/',
    licenseName: 'Creative Commons Attribution-ShareAlike 3.0',
    licenseHref: 'https://creativecommons.org/licenses/by-sa/3.0/',
    edrdgLicenseHref: null,
  },
];

export default function AttributionsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-foreground text-3xl font-extrabold">Attributions</h1>
      <p className="text-muted max-w-prose">
        This app&apos;s kanji and vocabulary data comes from the following open datasets. All were
        modified for use here — filtered, re-shaped, and split into shards for runtime lookups. Full
        processed files are available in this repository&apos;s public{' '}
        <code className="text-foreground">content/</code> directory.
      </p>
      <div className="flex flex-col gap-6">
        {DATASETS.map((dataset) => (
          <Card key={dataset.name}>
            <h2 className="text-foreground font-bold">{dataset.name}</h2>
            <p className="text-muted text-sm">
              Source:{' '}
              <a href={dataset.sourceHref} className="hover:text-foreground underline">
                {dataset.org}
              </a>
            </p>
            <p className="text-muted text-sm">
              License:{' '}
              <a href={dataset.licenseHref} className="hover:text-foreground underline">
                {dataset.licenseName}
              </a>
              {dataset.edrdgLicenseHref && (
                <>
                  {' '}
                  (
                  <a href={dataset.edrdgLicenseHref} className="hover:text-foreground underline">
                    EDRDG license terms
                  </a>
                  )
                </>
              )}
            </p>
            <p className="text-muted text-sm">Modified: yes</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
