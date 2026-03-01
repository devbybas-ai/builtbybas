export type PortfolioCategory = "websites" | "platforms" | "software" | "animation";

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: PortfolioCategory;
  description: string;
  capabilities: string[];
  technologies: string[];
  status: "live" | "in-progress" | "demo";
  featured: boolean;
  url?: string;
  colorAccent: string;
  isDemo?: boolean;
}

export interface PortfolioCategoryMeta {
  id: PortfolioCategory;
  label: string;
  description: string;
  color: string;
  icon: string;
}
