import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl sm:p-12">
        <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
          404
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-white">
          Page not found
        </h1>
        <p className="mt-4 max-w-md text-base leading-relaxed text-white/75">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-sky-500 px-8 text-base font-semibold text-white transition-colors hover:bg-sky-400"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
