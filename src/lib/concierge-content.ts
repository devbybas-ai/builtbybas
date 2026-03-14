// src/lib/concierge-content.ts

export type ConciergeScreen = "welcome" | "greeting" | "followup" | "matching" | "payoff";

export type CategoryId = "website" | "webapp" | "platform" | "other";

export type ConciergeIconName =
  | "Globe"
  | "LayoutDashboard"
  | "Layers"
  | "Sparkles"
  | "Check";

export type PriorityId = string; // varies per category

export interface ConciergeCategory {
  id: CategoryId;
  label: string;
  description: string;
  icon: ConciergeIconName;
}

export interface ConciergePriority {
  id: PriorityId;
  label: string;
}

export interface ConciergePayoff {
  projectSlug: string;
  tagline: string; // e.g., "We built this for a salon that wanted to stand out online"
  ctaLabel: string; // Intent-matched CTA, e.g., "Let's make your brand stand out"
}

export interface ConciergeContent {
  welcome: {
    headline: string;
    subtitle: string;
  };
  greeting: {
    headline: string;
    categories: ConciergeCategory[];
    skipLabel: string;
    skipHref: string;
  };
  followUps: Record<
    CategoryId,
    {
      headline: string;
      priorities: ConciergePriority[];
    }
  >;
  payoffs: Record<string, ConciergePayoff>; // key: "categoryId-priorityId"
  otherPayoff: {
    headline: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
  payoffSecondary: {
    label: string;
    href: string;
  };
  matchingText: string; // shown during labor illusion animation
}

export const conciergeContent: ConciergeContent = {
  welcome: {
    headline: "Welcome to BuiltByBas",
    subtitle: "Where we build solutions that work like your business does.",
  },
  greeting: {
    headline: "What are you building?",
    categories: [
      {
        id: "website",
        label: "A Website",
        description: "Marketing site, portfolio, or landing page",
        icon: "Globe",
      },
      {
        id: "webapp",
        label: "A Web App or Dashboard",
        description: "Internal tools, admin panels, or data dashboards",
        icon: "LayoutDashboard",
      },
      {
        id: "platform",
        label: "A Full Platform",
        description:
          "End-to-end system with portals, CRM, or multi-user access",
        icon: "Layers",
      },
      {
        id: "other",
        label: "Something Else",
        description: "Tell us about your idea",
        icon: "Sparkles",
      },
    ],
    skipLabel: "Just browsing? Browse our services \u2192",
    skipHref: "/services",
  },
  followUps: {
    website: {
      headline: "What matters most to you?",
      priorities: [
        { id: "design", label: "It needs to look incredible" },
        { id: "speed", label: "It needs to be fast and reliable" },
        { id: "budget", label: "I need it done right, on budget" },
      ],
    },
    webapp: {
      headline: "What matters most to you?",
      priorities: [
        { id: "realtime", label: "Real-time data and visibility" },
        { id: "ux", label: "An experience my team will actually use" },
        { id: "scale", label: "It needs to grow with us" },
      ],
    },
    platform: {
      headline: "What matters most to you?",
      priorities: [
        { id: "control", label: "End-to-end control over everything" },
        { id: "portal", label: "A portal my clients will love" },
        { id: "growth", label: "Built to scale as we grow" },
      ],
    },
    other: {
      headline: "",
      priorities: [],
    },
  },
  payoffs: {
    "website-design": {
      projectSlug: "the-colour-parlor",
      tagline: "We built this for a salon that wanted to stand out online",
      ctaLabel: "Let\u2019s make your brand stand out",
    },
    "website-speed": {
      projectSlug: "orca-child-in-the-wild",
      tagline:
        "We built this for a conservation nonprofit that needed to reach everyone",
      ctaLabel: "Let\u2019s build something fast and reliable",
    },
    "website-budget": {
      projectSlug: "the-colour-parlor",
      tagline:
        "We built this for a small business that needed maximum impact",
      ctaLabel: "Let\u2019s get you online \u2014 done right",
    },
    "webapp-realtime": {
      projectSlug: "all-beauty-hair-studio",
      tagline:
        "We built this for a studio that needed real-time visibility into their business",
      ctaLabel: "Let\u2019s give you real-time visibility",
    },
    "webapp-ux": {
      projectSlug: "all-beauty-hair-studio",
      tagline:
        "We built this for a team that needed tools they\u2019d actually enjoy using",
      ctaLabel: "Let\u2019s build tools your team will love",
    },
    "webapp-scale": {
      projectSlug: "all-beauty-hair-studio",
      tagline:
        "We built this to grow with the business \u2014 from one location to many",
      ctaLabel: "Let\u2019s build something that grows with you",
    },
    "platform-control": {
      projectSlug: "all-beauty-hair-studio",
      tagline:
        "We built this for a business that wanted to own every part of their operation",
      ctaLabel: "Let\u2019s put you in control",
    },
    "platform-portal": {
      projectSlug: "all-beauty-hair-studio",
      tagline:
        "We built this so their clients could see everything in one place",
      ctaLabel: "Let\u2019s give your clients a window in",
    },
    "platform-growth": {
      projectSlug: "figaro-barbershop",
      tagline:
        "We\u2019re building this for a barbershop that\u2019s ready to grow",
      ctaLabel: "Let\u2019s build something that scales with you",
    },
  },
  otherPayoff: {
    headline: "We\u2019d love to hear about it",
    body: "Every project is different \u2014 tell us about yours and we\u2019ll figure it out together.",
    ctaLabel: "Tell Us About Your Project",
    ctaHref: "/intake?type=other",
  },
  payoffSecondary: {
    label: "Explore our services \u2192",
    href: "/services",
  },
  matchingText: "Finding your match...",
};

/** Lookup helper — returns the payoff for a category+priority combo */
export function getPayoff(
  category: CategoryId,
  priority: PriorityId,
): ConciergePayoff | null {
  return conciergeContent.payoffs[`${category}-${priority}`] ?? null;
}

/** Build intake URL with progressive profiling params */
export function getIntakeHref(
  category: CategoryId,
  priority: PriorityId,
): string {
  return `/intake?type=${encodeURIComponent(category)}&priority=${encodeURIComponent(priority)}`;
}
