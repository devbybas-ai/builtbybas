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

export interface WalkthroughStep {
  phase: string;
  icon: string;
  title: string;
  description: string;
  deliverables: string[];
  duration: string;
}

export interface ServiceWalkthrough {
  tagline: string;
  steps: WalkthroughStep[];
  cta: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  priceRange: string;
  icon: ServiceIcon;
  features: string[];
  category: "web" | "software" | "ai";
  walkthrough?: ServiceWalkthrough;
}
