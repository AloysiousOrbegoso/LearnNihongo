import { redirect } from 'next/navigation';
import { AuthPanel } from '@/components/features/AuthPanel';
import { getVerifiedUser } from '@/lib/auth/session';

const PROMISES = ['Free forever, no card', 'Browse without an account', 'Open dictionary data'];

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await getVerifiedUser();
  if (user) redirect('/home');

  const { error } = await searchParams;

  return (
    <div className="border-border mx-auto flex max-w-3xl overflow-hidden rounded-lg border">
      <aside className="on-ink relative hidden w-[42%] flex-col justify-between overflow-hidden p-8 sm:flex">
        <span
          aria-hidden
          className="font-jp pointer-events-none absolute -right-8 -bottom-12 text-[11rem] leading-none text-white/5 select-none"
        >
          門
        </span>
        <div className="relative flex flex-col gap-9">
          <span className="text-[13px] font-medium tracking-widest uppercase">NihongoLearn</span>
          <div className="flex flex-col gap-3">
            <h1 className="display-3">Your decks are waiting.</h1>
            <p className="text-muted text-[13px] leading-relaxed">
              Progress, streaks, and scheduling sync across every device you sign in from.
            </p>
          </div>
        </div>
        <ul className="relative flex flex-col gap-2.5">
          {PROMISES.map((line) => (
            <li key={line} className="text-muted flex items-center gap-2.5 text-[13px]">
              <span className="text-accent" aria-hidden>
                ✓
              </span>
              {line}
            </li>
          ))}
        </ul>
      </aside>

      <div className="bg-surface flex flex-1 flex-col gap-6 p-8 sm:p-10">
        <div>
          <h2 className="display-3 mb-1">Sign in</h2>
          <p className="text-muted text-[13px]">New here? An account is created automatically.</p>
        </div>

        {error && (
          <p className="bg-accent-soft text-accent-soft-foreground rounded-md px-3.5 py-2.5 text-sm">
            Something went wrong signing in. Please try again.
          </p>
        )}

        <a
          href="/auth/sign-in/google"
          className="border-border-strong bg-surface text-foreground hover:bg-surface-sunken inline-flex items-center justify-center gap-2 rounded-md border px-4.5 py-2.5 text-sm font-medium transition-colors"
        >
          Continue with Google
        </a>

        <div className="text-subtle flex items-center gap-3 text-xs uppercase">
          <div className="bg-border h-px flex-1" />
          or
          <div className="bg-border h-px flex-1" />
        </div>

        <AuthPanel />
      </div>
    </div>
  );
}
