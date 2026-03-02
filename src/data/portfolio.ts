import type { PortfolioProject, PortfolioCategory, PortfolioCategoryMeta } from "@/types/portfolio";

export const categoryMeta: PortfolioCategoryMeta[] = [
  {
    id: "websites",
    label: "Websites",
    description: "Custom marketing websites and landing pages",
    color: "bg-cyan-500/20 text-cyan-400",
    icon: "globe",
  },
  {
    id: "platforms",
    label: "Platforms",
    description: "Full-stack web applications and tools",
    color: "bg-violet-500/20 text-violet-400",
    icon: "layers",
  },
  {
    id: "software",
    label: "Software",
    description: "Business tools, dashboards, and internal systems",
    color: "bg-emerald-500/20 text-emerald-400",
    icon: "layout-dashboard",
  },
  {
    id: "animation",
    label: "Animation",
    description: "Motion design and interactive experiences",
    color: "bg-amber-500/20 text-amber-400",
    icon: "sparkles",
  },
];

export const projects: PortfolioProject[] = [
  // === WEBSITES ===
  {
    id: "the-colour-parlor",
    slug: "the-colour-parlor",
    title: "The Colour Parlor",
    subtitle: "Premium hair salon with booking and gallery showcase",
    category: "websites",
    description:
      "We designed and built a polished marketing website for a hair salon in Wildomar, California. The site features an elegant teal color palette, service catalog with pricing, a stylist portfolio gallery showcasing real transformations, and integrated appointment booking. Every page is optimized for local search and mobile-first browsing.",
    capabilities: [
      "Responsive Design",
      "Local SEO",
      "Booking Integration",
      "Gallery System",
      "Mobile-First",
    ],
    technologies: ["Custom Design", "SEO", "Responsive CSS", "Gallery Components"],
    status: "live",
    featured: true,
    url: "https://thecolourparlor.com",
    colorAccent: "teal",
    image: "/portfolio/colourparlor/the-colour-parlor.webp",
  },
  {
    id: "orca-child-in-the-wild",
    slug: "orca-child-in-the-wild",
    title: "Orca Child in the Wild",
    subtitle: "Youth-led conservation nonprofit with bilingual support",
    category: "websites",
    description:
      "We built the digital home for a youth-run 501(c)(3) aquatic conservation nonprofit operating across Southern California. The site features ocean-inspired design with coastal photography, bilingual English/Spanish support, volunteer signup with parental consent workflows, donation integration, weather and tide data, and a comprehensive educational resource library. Dark/light mode, smooth animations, and WCAG-accessible throughout.",
    capabilities: [
      "Bilingual Support",
      "Nonprofit UX",
      "Donation Integration",
      "Volunteer Management",
      "Accessibility",
      "Dark/Light Mode",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "i18n",
      "Lucide Icons",
    ],
    status: "live",
    featured: true,
    url: "https://orcachildinthewild.com",
    colorAccent: "blue",
    image: "/portfolio/orcachild/orca-child-in-the-wild.webp",
    gallery: [
      "/portfolio/orcachild/orcachildabout.webp",
      "/portfolio/orcachild/orcachildspecies.webp",
      "/portfolio/orcachild/orcachildspeciesport.webp",
      "/portfolio/orcachild/orcachildevents.webp",
      "/portfolio/orcachild/orcachildspanish.webp",
      "/portfolio/orcachild/orcachildvolunteer.webp",
      "/portfolio/orcachild/orcachildvolunteerform.webp",
      "/portfolio/orcachild/orcachildtideinfo.webp",
      "/portfolio/orcachild/orcachildNOOAAPI.webp",
    ],
  },
  {
    id: "all-beauty-hair-studio",
    slug: "all-beauty-hair-studio",
    title: "All Beauty Hair Studio",
    subtitle: "Complete website redesign from template to custom build",
    category: "websites",
    description:
      "A full website redesign for a beauty and hair salon currently running on a generic Wix template. We are rebuilding the entire online presence with custom design, modern performance standards, mobile-first responsive layout, and conversion-optimized booking flow. The transformation takes the brand from template-constrained to fully custom.",
    capabilities: [
      "Website Redesign",
      "Custom Design",
      "Performance Optimization",
      "Mobile-First",
      "Brand Elevation",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Custom Design"],
    status: "in-progress",
    featured: false,
    url: "https://allbeautyhairstudio.com",
    colorAccent: "pink",
  },

  // === PARTNERSHIPS ===
  {
    id: "marketing-reset",
    slug: "marketing-reset",
    title: "Marketing Reset",
    subtitle: "Marketing strategy redesign company built from the ground up",
    category: "platforms",
    description:
      "A full-brand partnership building a marketing strategy company from scratch. Marketing Reset helps businesses rethink and redesign their marketing approach with data-driven strategies, competitive analysis, and clear execution plans. We are building the complete digital platform — brand identity, client onboarding, strategy delivery system, and results dashboards. Everything custom, everything aligned to conversion.",
    capabilities: [
      "Brand Identity",
      "Strategy Platform",
      "Client Onboarding",
      "Results Dashboards",
      "Competitive Analysis",
      "Conversion Tracking",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Analytics"],
    status: "in-progress",
    featured: false,
    colorAccent: "rose",
  },
  {
    id: "small-business-web-co",
    slug: "small-business-web-co",
    title: "Small Business Web Co",
    subtitle: "Complete $500 web solutions for businesses getting started",
    category: "platforms",
    description:
      "A partnership brand delivering complete web solutions at an accessible price point. Small Business Web Co provides businesses with a professional website, hosting, and launch package for $500 — no hidden fees, no upselling. We are building the platform that powers the entire operation: client intake, template customization engine, automated deployment pipeline, and ongoing hosting management. Making quality accessible.",
    capabilities: [
      "Automated Deployment",
      "Template Engine",
      "Client Portal",
      "Hosting Management",
      "Payment Processing",
      "Scalable Architecture",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL", "Stripe"],
    status: "in-progress",
    featured: false,
    colorAccent: "green",
  },

  // === PLATFORMS ===
  {
    id: "praxis-library",
    slug: "praxis-library",
    title: "Praxis Library",
    subtitle: "AI literacy platform with 5,000+ terms and interactive tools",
    category: "platforms",
    description:
      "We built a comprehensive AI education platform serving as the open standard in AI literacy. The platform houses over 5,000 searchable AI terms, 177 techniques and frameworks, and a suite of interactive tools including a Prompt Analyzer, Prompt Builder, Technique Finder, and Persona Architect. Features a neurodivergence hub with ADHD and autism-specific resources. WCAG AA accessible with adjustable text sizing, high-contrast modes, and read-aloud functionality.",
    capabilities: [
      "Search System",
      "Interactive Tools",
      "Accessibility (WCAG AA)",
      "Content Architecture",
      "Neurodivergent Design",
      "Educational UX",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Search Engine",
      "Accessibility Tools",
    ],
    status: "live",
    featured: true,
    url: "https://praxislibrary.com",
    colorAccent: "indigo",
    image: "/portfolio/praxislibrary/praxis-library.webp",
  },
  {
    id: "builtbybas",
    slug: "builtbybas",
    title: "BuiltByBas",
    subtitle: "The agency platform you are looking at right now",
    category: "platforms",
    description:
      "This very site — a full-stack agency platform with glassmorphism design system, particle-driven hero animations, multi-step intake form with algorithmic analysis engine, admin dashboard with scoring visualizations, and a live portfolio system. Built on Next.js with TypeScript strict mode, custom authentication, and a complete design token system. Every component is accessible, every animation respects reduced motion preferences.",
    capabilities: [
      "Design System",
      "Animation Engine",
      "Intake Analysis",
      "Admin Dashboard",
      "Glassmorphism",
      "Full Stack",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS 4",
      "Framer Motion",
      "PostgreSQL",
      "Zod",
    ],
    status: "live",
    featured: true,
    url: "https://builtbybas.com",
    colorAccent: "cyan",
    image: "/portfolio/builtbybas/builtbybas.webp",
    gallery: [
      "/portfolio/builtbybas/builtbybasServices.webp",
      "/portfolio/builtbybas/builtbybasportfolio.webp",
      "/portfolio/builtbybas/builtbybasIntakeform.webp",
      "/portfolio/builtbybas/builtbybasinfomrational.webp",
    ],
  },

  // === SOFTWARE ===
  {
    id: "kar-crm",
    slug: "kar-crm",
    title: "KAR CRM",
    subtitle: "Full client relationship management system",
    category: "software",
    description:
      "A complete CRM system built from the ground up for real business operations. Features pipeline management with visual deal tracking, client contact database, activity logging, task management, and reporting dashboards. Designed for speed and simplicity — no bloat, no unnecessary features, just the tools a business actually needs to manage client relationships and close deals.",
    capabilities: [
      "Pipeline Management",
      "Contact Database",
      "Activity Tracking",
      "Task Management",
      "Reporting",
      "CRUD Operations",
    ],
    technologies: [
      "React",
      "TypeScript",
      "Node.js",
      "Database",
      "REST API",
    ],
    status: "live",
    featured: false,
    colorAccent: "emerald",
  },

  // === ANIMATION ===
  {
    id: "motion-gallery",
    slug: "motion-gallery",
    title: "Motion Gallery",
    subtitle: "Interactive animation specimens you can touch and trigger",
    category: "animation",
    description:
      "A curated gallery of interactive animation specimens showcasing spring physics, scroll-linked effects, stagger reveals, morphing shapes, gesture interactions, and loading patterns. Each specimen is a hands-on playground — drag, scroll, hover, and trigger to feel the motion design in action.",
    capabilities: [
      "Spring Physics",
      "Scroll Effects",
      "Stagger Animations",
      "Gesture Handling",
      "Micro-Interactions",
      "Performance",
    ],
    technologies: ["Framer Motion", "React", "TypeScript", "CSS Animations"],
    status: "demo",
    featured: false,
    isDemo: true,
    colorAccent: "amber",
  },
  {
    id: "kinetic-typography",
    slug: "kinetic-typography",
    title: "Kinetic Typography",
    subtitle: "Text animation lab with replay controls",
    category: "animation",
    description:
      "A showcase of text animation techniques: word-by-word reveals, character cascades, typewriter effects, gradient sweeps, split-flips, wave motion, and blur-in transitions. Each technique is isolated in its own specimen with a replay button so you can study the timing and easing.",
    capabilities: [
      "Text Animation",
      "Typography Design",
      "Timing Control",
      "Creative Motion",
      "Accessibility",
    ],
    technologies: ["Framer Motion", "React", "TypeScript", "CSS"],
    status: "demo",
    featured: false,
    isDemo: true,
    colorAccent: "amber",
  },
  {
    id: "micro-interactions",
    slug: "micro-interactions",
    title: "Micro-Interactions",
    subtitle: "UI feedback patterns that make interfaces feel alive",
    category: "animation",
    description:
      "A collection of polished micro-interaction patterns: toggle switches with spring physics, animated success checkmarks, like buttons with particle bursts, notification bells with shake and badge animations, SVG progress rings, expandable cards, material ripple effects, and magnetic hover buttons. Each specimen demonstrates a production-ready UI pattern.",
    capabilities: [
      "Toggle Animations",
      "SVG Path Drawing",
      "Gesture Response",
      "State Feedback",
      "Spring Physics",
      "Ripple Effects",
    ],
    technologies: ["Framer Motion", "React", "TypeScript", "SVG"],
    status: "demo",
    featured: false,
    isDemo: true,
    colorAccent: "cyan",
  },
  {
    id: "layout-animations",
    slug: "layout-animations",
    title: "Layout Animations",
    subtitle: "Smooth transitions between UI states and arrangements",
    category: "animation",
    description:
      "Showcasing Framer Motion's layout animation system: shared layout tabs with sliding indicators, drag-to-reorder lists, grid-to-list view transitions, animated accordions, digit-flip counters, and 3D flip cards. These patterns demonstrate how to make UI state changes feel smooth and intentional.",
    capabilities: [
      "Shared Layout",
      "Drag Reorder",
      "View Transitions",
      "3D Transforms",
      "Counter Animation",
      "Accordion",
    ],
    technologies: ["Framer Motion", "React", "TypeScript", "LayoutGroup"],
    status: "demo",
    featured: false,
    isDemo: true,
    colorAccent: "violet",
  },
  {
    id: "svg-animations",
    slug: "svg-animations",
    title: "SVG & Path Animations",
    subtitle: "Vector graphics brought to life with motion",
    category: "animation",
    description:
      "A deep dive into SVG animation techniques: logo path drawing with fill reveal, icon morphing between shapes, animated checkmark sequences, generative sine waves, segmented and orbital SVG spinners, handwriting path effects, and spring-animated bar charts. All rendered as scalable vector graphics.",
    capabilities: [
      "Path Drawing",
      "Icon Morphing",
      "Generative Art",
      "Data Visualization",
      "SVG Spinners",
      "Handwriting",
    ],
    technologies: ["Framer Motion", "React", "TypeScript", "SVG"],
    status: "demo",
    featured: false,
    isDemo: true,
    colorAccent: "emerald",
  },
  {
    id: "scroll-animations",
    slug: "scroll-animations",
    title: "Scroll Animations",
    subtitle: "Scroll-driven effects and viewport-triggered reveals",
    category: "animation",
    description:
      "Interactive scroll-based animation specimens: multi-speed parallax layers, smooth scroll progress bars, directional scroll reveals with useInView, counting number counters triggered on viewport entry, and sticky navigation that tracks scroll position. Each specimen contains its own scrollable area to demonstrate the technique.",
    capabilities: [
      "Parallax Scrolling",
      "Scroll Progress",
      "Viewport Detection",
      "Sticky Positioning",
      "Number Animation",
    ],
    technologies: ["Framer Motion", "React", "TypeScript", "useScroll"],
    status: "demo",
    featured: false,
    isDemo: true,
    colorAccent: "rose",
  },
];

export function getProjectBySlug(slug: string): PortfolioProject | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): PortfolioProject[] {
  return projects.filter((p) => p.featured);
}

export function getProjectsByCategory(
  category: PortfolioCategory | "all",
): PortfolioProject[] {
  if (category === "all") return projects;
  return projects.filter((p) => p.category === category);
}

export function getCategoryMeta(id: PortfolioCategory): PortfolioCategoryMeta | undefined {
  return categoryMeta.find((c) => c.id === id);
}
