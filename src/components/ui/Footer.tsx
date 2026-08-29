import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted mx-auto max-w-3xl px-6 py-6 text-sm">
        <Link href="/attributions" className="hover:text-foreground">
          Attributions &amp; data licensing
        </Link>
      </div>
    </footer>
  );
}
