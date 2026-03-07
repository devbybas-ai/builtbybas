"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Kanban,
  ClipboardList,
  FolderOpen,
  FileText,
  Receipt,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/demo", label: "Dashboard", icon: LayoutDashboard },
  { href: "/demo/clients", label: "Clients", icon: Users },
  { href: "/demo/pipeline", label: "Pipeline", icon: Kanban },
  { href: "/demo/intake", label: "Intake", icon: ClipboardList },
  { href: "/demo/projects", label: "Projects", icon: FolderOpen },
  { href: "/demo/proposals", label: "Proposals", icon: FileText },
  { href: "/demo/invoices", label: "Invoices", icon: Receipt },
  { href: "/demo/analytics", label: "Analytics", icon: BarChart3 },
];

export function DemoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-white/8 bg-sidebar md:flex">
      <div className="flex h-16 items-center justify-between border-b border-white/8 px-6">
        <Link
          href="/demo"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          Built<span className="text-primary">By</span>Bas
        </Link>
        <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-400">
          DEMO
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Demo navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === "/demo"
              ? pathname === "/demo"
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

      <div className="border-t border-white/8 p-4">
        <Link
          href="/start"
          className="btn-shine neon-glow flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start Your Project
        </Link>
      </div>
    </aside>
  );
}
