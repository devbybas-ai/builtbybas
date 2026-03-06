"use client";

import { useEffect, useState } from "react";
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
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationCounts {
  intake: number;
  proposals: number;
  invoices: number;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, badgeKey: null },
  { href: "/admin/clients", label: "Clients", icon: Users, badgeKey: null },
  { href: "/admin/pipeline", label: "Pipeline", icon: Kanban, badgeKey: null },
  { href: "/admin/intake", label: "Intake", icon: ClipboardList, badgeKey: "intake" as const },
  { href: "/admin/projects", label: "Projects", icon: FolderOpen, badgeKey: null },
  { href: "/admin/proposals", label: "Proposals", icon: FileText, badgeKey: "proposals" as const },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt, badgeKey: "invoices" as const },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, badgeKey: null },
  { href: "/admin/settings", label: "Settings", icon: Settings, badgeKey: null },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [counts, setCounts] = useState<NotificationCounts | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCounts() {
      try {
        const res = await fetch("/api/admin/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setCounts(data);
      } catch {
        // Silently fail — badges are non-critical
      }
    }

    fetchCounts();

    // Refresh every 60 seconds
    const interval = setInterval(fetchCounts, 60_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [pathname]);

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-white/8 bg-sidebar md:flex">
      <div className="flex h-16 items-center border-b border-white/8 px-6">
        <Link
          href="/admin"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          Built<span className="text-primary">By</span>Bas
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Admin navigation">
        {navItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          const badgeCount =
            item.badgeKey && counts ? counts[item.badgeKey] : 0;

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
              {badgeCount > 0 && (
                <span className="ml-auto flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary/20 px-1.5 text-[10px] font-bold text-primary">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
