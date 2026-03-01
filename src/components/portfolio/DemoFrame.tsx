"use client";

import { cn } from "@/lib/utils";

interface DemoFrameProps {
  url: string;
  children: React.ReactNode;
  className?: string;
}

export function DemoFrame({ url, children, className }: DemoFrameProps) {
  return (
    <div className={cn("glass-card overflow-hidden", className)}>
      {/* Browser Chrome */}
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
        </div>
        <div className="ml-2 flex-1 rounded-md bg-white/5 px-3 py-1 text-xs text-muted-foreground">
          {url}
        </div>
      </div>
      {/* Content */}
      <div className="relative">{children}</div>
    </div>
  );
}
