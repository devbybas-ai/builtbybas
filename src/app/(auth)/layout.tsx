export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Built<span className="text-primary">By</span>Bas
          </h1>
        </div>
        {children}
      </div>
    </main>
  );
}
