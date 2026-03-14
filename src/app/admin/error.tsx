"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Admin Error
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
          Something went wrong loading this admin page. Please try again.
        </p>
        {error.digest && (
          <p className="mt-3 text-sm text-white/50">
            Error ID: {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-sky-500 px-8 text-base font-semibold text-white transition-colors hover:bg-sky-400"
          >
            Try Again
          </button>
          <a
            href="/admin"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-white/20 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
