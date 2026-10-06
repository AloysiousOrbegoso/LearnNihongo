import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans_JP, Instrument_Serif } from 'next/font/google';
import '@/styles/globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-instrument-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NihongoLearn — stop forgetting Japanese',
    template: '%s · NihongoLearn',
  },
  description:
    'Every jōyō kanji with real stroke order, 22,000+ vocabulary entries, and spaced repetition that shows you a word right before you forget it. Free.',
  openGraph: {
    type: 'website',
    siteName: 'NihongoLearn',
    title: 'NihongoLearn — stop forgetting Japanese',
    description:
      'Every jōyō kanji with real stroke order, 22,000+ vocabulary entries, and spaced repetition. Free.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${notoSansJP.variable} ${instrumentSerif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
