export type PortfolioCategory = "websites" | "platforms" | "systems" | "animation" | "concept";

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
  image?: string;
  gallery?: string[];
  health?: {
    security: number;
    accessibility: number;
    performance: number;
    stability: number;
  };
  healthChecklist?: {
    security: boolean[];
    accessibility: boolean[];
    performance: boolean[];
    stability: boolean[];
  };
  scope?: string[];
  challenge?: string;
  approach?: string;
  techChoices?: { tech: string; reason: string }[];
}

export interface PortfolioCategoryMeta {
  id: PortfolioCategory;
  label: string;
  description: string;
  color: string;
  icon: string;
}
