export type ServiceIcon =
  | "globe"
  | "refresh"
  | "rocket"
  | "layout-dashboard"
  | "users"
  | "shopping-cart"
  | "database"
  | "layers"
  | "cpu";

export interface Service {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  icon: ServiceIcon;
  features: string[];
  category: "web" | "software" | "ai";
}
