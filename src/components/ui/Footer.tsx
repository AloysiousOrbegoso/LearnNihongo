import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="text-muted mx-auto flex max-w-3xl items-center justify-between px-6 py-6 text-sm">
        <span>頑張って — keep going.</span>
        <Link href="/attributions" className="hover:text-foreground">
          Attributions &amp; data licensing
        </Link>
      </div>
    </footer>
  );
}
