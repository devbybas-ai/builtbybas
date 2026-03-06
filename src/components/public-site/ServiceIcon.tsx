import {
  Globe,
  RefreshCw,
  Rocket,
  LayoutDashboard,
  Users,
  ShoppingCart,
  Database,
  Layers,
  Cpu,
} from "lucide-react";
import type { ServiceIcon as ServiceIconType } from "@/types/services";

const iconMap: Record<ServiceIconType, React.ComponentType<{ className?: string }>> = {
  globe: Globe,
  refresh: RefreshCw,
  rocket: Rocket,
  "layout-dashboard": LayoutDashboard,
  users: Users,
  "shopping-cart": ShoppingCart,
  database: Database,
  layers: Layers,
  cpu: Cpu,
};

interface ServiceIconProps {
  icon: ServiceIconType;
  className?: string;
  bare?: boolean;
}

export function ServiceIcon({ icon, className, bare }: ServiceIconProps) {
  const Icon = iconMap[icon];
  if (bare) {
    return <Icon className={className ?? "h-6 w-6 text-primary"} />;
  }
  return (
    <div className="inline-flex rounded-xl bg-primary/10 p-3">
      <Icon className={className ?? "h-6 w-6 text-primary"} />
    </div>
  );
}
