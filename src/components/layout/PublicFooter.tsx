import Link from "next/link";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/?start", label: "Start a Project" },
];

const policyLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Policy" },
  { href: "/refund", label: "Refund Policy" },
  { href: "/ai-policy", label: "Responsible AI" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          <div>
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              <span className="text-primary">Built</span>By<span className="text-primary">Bas</span>
            </Link>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex h-10 items-center rounded-lg px-3 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-white/10 pt-8">
          <nav aria-label="Policy links">
            <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex h-9 items-center rounded-lg px-2.5 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground sm:text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} BuiltByBas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
