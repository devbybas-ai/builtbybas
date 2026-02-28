"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderOpen, Receipt, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/portal", label: "My Projects", icon: FolderOpen },
  { href: "/portal/invoices", label: "Invoices", icon: Receipt },
  { href: "/portal/messages", label: "Messages", icon: MessageSquare },
];

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-white/8 bg-sidebar md:flex">
      <div className="flex h-16 items-center border-b border-white/8 px-6">
        <Link
          href="/portal"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          Built<span className="text-primary">By</span>Bas
        </Link>
        <span className="ml-2 rounded-md bg-primary/10 px-2 py-0.5 text-xs text-primary">
          Portal
        </span>
      </div>

      <nav
        className="flex-1 space-y-1 px-3 py-4"
        aria-label="Portal navigation"
      >
        {navItems.map((item) => {
          const isActive =
            item.href === "/portal"
              ? pathname === "/portal"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
