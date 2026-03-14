export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Page title skeleton */}
      <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />

      {/* Stats row skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <div className="h-4 w-20 animate-pulse rounded bg-white/10" />
            <div className="mt-3 h-7 w-16 animate-pulse rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-white/10" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-white/10" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
