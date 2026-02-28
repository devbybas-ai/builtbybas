import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: "div" | "section" | "article";
}

export function GlassCard({
  children,
  className,
  hover = false,
  as: Component = "div",
}: GlassCardProps) {
  return (
    <Component
      className={cn(
        hover ? "glass-card-hover" : "glass-card",
        "p-6",
        className
      )}
    >
      {children}
    </Component>
  );
}
