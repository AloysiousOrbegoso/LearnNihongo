import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Noto_Sans_JP } from 'next/font/google';
import '@/styles/globals.css';

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'NihongoLearn',
    template: '%s · NihongoLearn',
  },
  description: 'Learn Japanese vocabulary and kanji with spaced repetition.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={notoSansJP.variable}>
      <body>{children}</body>
    </html>
  );
}
