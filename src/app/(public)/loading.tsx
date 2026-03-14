export default function PublicLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-sky-400" />
        <p className="text-sm text-white/75">Loading...</p>
      </div>
    </div>
  );
}
