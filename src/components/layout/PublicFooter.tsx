import Link from "next/link";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/intake", label: "Start a Project" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              Built<span className="text-primary">By</span>Bas
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Custom software &amp; web development for your business.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center gap-6">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} BuiltByBas. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
