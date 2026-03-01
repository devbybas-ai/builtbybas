export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  client: string;
  category: "web" | "software" | "ai";
  description: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  features: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  images: {
    thumbnail: string;
    hero: string;
    gallery: string[];
  };
  url?: string;
  featured: boolean;
  completedAt: string;
}
