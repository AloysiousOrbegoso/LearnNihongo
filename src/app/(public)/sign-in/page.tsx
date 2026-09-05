import { redirect } from 'next/navigation';
import { AuthPanel } from '@/components/features/AuthPanel';
import { getVerifiedUser } from '@/lib/auth/session';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getVerifiedUser();
  if (user) redirect('/decks');

  const { error } = await searchParams;

  return (
    <div className="flex flex-col items-center gap-8 py-12">
      <h1 className="text-foreground text-2xl font-semibold">Sign in</h1>
      {error && (
        <p className="text-accent text-sm">Something went wrong signing in. Please try again.</p>
      )}
      <a
        href="/auth/sign-in/google"
        className="bg-accent text-accent-foreground rounded-md px-4 py-2"
      >
        Sign in with Google
      </a>
      <div className="text-muted flex w-full max-w-sm items-center gap-3 text-sm">
        <div className="bg-border h-px flex-1" />
        or
        <div className="bg-border h-px flex-1" />
      </div>
      <AuthPanel />
    </div>
  );
}
