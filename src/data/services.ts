import type { Service } from "@/types/services";

export const services: Service[] = [
  {
    id: "marketing-websites",
    title: "Marketing Websites",
    description:
      "Custom responsive websites designed to convert visitors into customers. SEO-optimized, accessible, and built to make your business stand out from the competition.",
    priceRange: "$2,500 - $8,000",
    icon: "globe",
    features: [
      "Custom responsive design",
      "SEO optimization",
      "WCAG accessibility",
      "Analytics integration",
      "Content management",
    ],
    category: "web",
  },
  {
    id: "website-redesigns",
    title: "Website Redesigns",
    description:
      "Transform your outdated website into a modern, high-performing machine. Performance-optimized rebuilds that respect your brand while pushing it forward.",
    priceRange: "$3,000 - $10,000",
    icon: "refresh",
    features: [
      "Modern design language",
      "Performance optimization",
      "Mobile-first rebuild",
      "Brand consistency",
      "Migration support",
    ],
    category: "web",
  },
  {
    id: "landing-pages",
    title: "Landing Pages",
    description:
      "High-conversion single-page sites built for one purpose: turning visitors into leads. Every element engineered for maximum impact.",
    priceRange: "$1,000 - $3,000",
    icon: "rocket",
    features: [
      "Conversion optimization",
      "A/B test ready",
      "Fast load times",
      "Lead capture forms",
      "Analytics tracking",
    ],
    category: "web",
  },
  {
    id: "business-dashboards",
    title: "Business Dashboards",
    description:
      "Custom admin panels and internal tools that give you real-time visibility into your operations. Make faster decisions with better data.",
    priceRange: "$5,000 - $20,000",
    icon: "layout-dashboard",
    features: [
      "Real-time data visualization",
      "Role-based access control",
      "Custom reporting",
      "API integrations",
      "Mobile responsive",
    ],
    category: "software",
  },
  {
    id: "client-portals",
    title: "Client Portals",
    description:
      "Give your clients a branded window into their projects. Track progress, share deliverables, manage invoices — all in one professional space.",
    priceRange: "$4,000 - $15,000",
    icon: "users",
    features: [
      "Project tracking",
      "Document sharing",
      "Invoice management",
      "Secure messaging",
      "Branded experience",
    ],
    category: "software",
  },
  {
    id: "e-commerce",
    title: "E-Commerce",
    description:
      "Custom storefronts that sell. Not a Shopify template — a ground-up build designed around your products, your brand, and your customers.",
    priceRange: "$8,000 - $25,000",
    icon: "shopping-cart",
    features: [
      "Custom storefront design",
      "Payment processing",
      "Inventory management",
      "Order fulfillment",
      "Customer accounts",
    ],
    category: "software",
  },
  {
    id: "crm-systems",
    title: "CRM Systems",
    description:
      "Stop losing leads in spreadsheets. Custom CRM systems that track every client, every deal, every follow-up — built exactly for how you work.",
    priceRange: "$8,000 - $25,000",
    icon: "database",
    features: [
      "Lead tracking & scoring",
      "Pipeline management",
      "Automated follow-ups",
      "Reporting & analytics",
      "Email integration",
    ],
    category: "software",
  },
  {
    id: "full-operations-platform",
    title: "Full Operations Platform",
    description:
      "The complete package: website, CRM, client portal, invoicing, and AI tools — unified in one custom-built platform that runs your entire business.",
    priceRange: "$15,000 - $50,000+",
    icon: "layers",
    features: [
      "All-in-one solution",
      "Custom integrations",
      "Automated workflows",
      "Client self-service",
      "Scalable architecture",
    ],
    category: "software",
  },
  {
    id: "ai-powered-tools",
    title: "AI-Powered Tools",
    description:
      "Custom AI assistants, content generators, and automation tools that give your business an unfair advantage. Built with responsible AI principles.",
    priceRange: "$10,000 - $40,000",
    icon: "cpu",
    features: [
      "Custom AI assistants",
      "Content automation",
      "Smart recommendations",
      "Process automation",
      "Human-in-the-loop design",
    ],
    category: "ai",
  },
];
