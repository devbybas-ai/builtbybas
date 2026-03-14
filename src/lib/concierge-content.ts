// src/lib/concierge-content.ts

export type ConciergeScreen =
  | "welcome"
  | "category"
  | "qualifier"
  | "qualifier-expanded"
  | "priority"
  | "timeline"
  | "confirmation";

export type CategoryId = "website" | "webapp" | "platform" | "other";

export type ConciergeIconName =
  | "Globe"
  | "LayoutDashboard"
  | "Layers"
  | "Sparkles"
  | "Check"
  | "RefreshCw"
  | "FileText"
  | "BarChart3"
  | "Users"
  | "Target"
  | "ShoppingCart"
  | "HelpCircle"
  | "Clock";

export type PriorityId = string; // varies per category

export type QualifierId =
  | "marketing-website"
  | "website-redesign"
  | "landing-page"
  | "business-dashboard"
  | "client-portal"
  | "crm-system"
  | "ai-tools"
  | "full-platform"
  | "ecommerce";

export type TimelineId = "asap" | "2-4-weeks" | "5-6-weeks" | "flexible";

export interface ConciergeCategory {
  id: CategoryId;
  label: string;
  description: string;
  icon: ConciergeIconName;
}

export interface ConciergePriority {
  id: PriorityId;
  label: string;
  icon?: ConciergeIconName;
}

export interface ConciergeQualifier {
  id: QualifierId;
  label: string;
  description: string;
  icon: ConciergeIconName;
}

export interface ConciergeTimeline {
  id: TimelineId;
  label: string;
}

export interface ConciergeQualifierGroup {
  headline: string;
  options: ConciergeQualifier[];
  hasSomethingElse: boolean;
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
  qualifiers: Record<Exclude<CategoryId, "other">, ConciergeQualifierGroup>;
  timelines: ConciergeTimeline[];
  otherPriorities: ConciergePriority[];
  confirmation: {
    headline: string;
    standardTemplate: {
      serviceLine: string;
      priorityLine: string;
      timelineLine: string;
      closing: string;
    };
    otherTemplate: {
      serviceLine: string;
      priorityLine: string;
      timelineLine: string;
      closing: string;
    };
  };
}

export const conciergeContent: ConciergeContent = {
  welcome: {
    headline: "Welcome to BuiltByBas",
    subtitle: "We build solutions shaped around your business.",
  },
  greeting: {
    headline: "What are we building?",
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
      headline: "What matters most in this project?",
      priorities: [
        { id: "design", label: "It needs to look incredible", icon: "Check" },
        { id: "speed", label: "It needs to be fast and reliable", icon: "Check" },
        { id: "budget", label: "I need it done right, on budget", icon: "Check" },
      ],
    },
    webapp: {
      headline: "What matters most in this project?",
      priorities: [
        { id: "realtime", label: "Real-time data and visibility", icon: "Check" },
        { id: "ux", label: "An experience my team will actually use", icon: "Check" },
        { id: "scale", label: "It needs to grow with us", icon: "Check" },
      ],
    },
    platform: {
      headline: "What matters most in this project?",
      priorities: [
        { id: "control", label: "End-to-end control over everything", icon: "Check" },
        { id: "portal", label: "A portal my clients will love", icon: "Check" },
        { id: "growth", label: "Built to scale as we grow", icon: "Check" },
      ],
    },
    other: {
      headline: "",
      priorities: [],
    },
  },
  qualifiers: {
    website: {
      headline: "Is this a...",
      options: [
        {
          id: "marketing-website",
          label: "A brand new site",
          description: "Start fresh with a custom website",
          icon: "Globe",
        },
        {
          id: "website-redesign",
          label: "A redesign",
          description: "Rebuild and improve your current site",
          icon: "RefreshCw",
        },
        {
          id: "landing-page",
          label: "A single landing page",
          description: "One focused page to drive action",
          icon: "FileText",
        },
      ],
      hasSomethingElse: false,
    },
    webapp: {
      headline: "What kind of tool are you looking for?",
      options: [
        {
          id: "business-dashboard",
          label: "A dashboard to see my business data",
          description: "Real-time visibility into your operations",
          icon: "BarChart3",
        },
        {
          id: "client-portal",
          label: "A portal for my clients",
          description: "Give your clients their own login",
          icon: "Users",
        },
        {
          id: "crm-system",
          label: "A system to track leads and sales",
          description: "Manage your pipeline and close more deals",
          icon: "Target",
        },
        {
          id: "ai-tools",
          label: "A tool powered by AI",
          description: "Automate tasks with artificial intelligence",
          icon: "Sparkles",
        },
      ],
      hasSomethingElse: true,
    },
    platform: {
      headline: "What does your platform need to do?",
      options: [
        {
          id: "full-platform",
          label: "Run my entire business operations",
          description: "End-to-end system with CRM, portals, and more",
          icon: "Layers",
        },
        {
          id: "ecommerce",
          label: "Sell products or services online",
          description: "Online store with payments and shipping",
          icon: "ShoppingCart",
        },
      ],
      hasSomethingElse: true,
    },
  },
  timelines: [
    { id: "asap", label: "ASAP -- I needed this yesterday" },
    { id: "2-4-weeks", label: "2-4 weeks" },
    { id: "5-6-weeks", label: "5-6 weeks" },
    { id: "flexible", label: "Flexible -- quality over speed" },
  ],
  otherPriorities: [
    { id: "quality", label: "Quality -- built right, no shortcuts", icon: "Check" },
    { id: "speed", label: "Speed -- I need this fast", icon: "Check" },
    { id: "budget", label: "Budget -- I need it done smart", icon: "Check" },
  ],
  confirmation: {
    headline: "Here's what we heard.",
    standardTemplate: {
      serviceLine: "You're looking for a {service}.",
      priorityLine: "{priority} matters most.",
      timelineLine: "And you need it {timeline}.",
      closing: "We've got the right form ready for you.",
    },
    otherTemplate: {
      serviceLine: "You've got something unique in mind.",
      priorityLine: "{priority} matters most.",
      timelineLine: "And you're {timeline}.",
      closing: "Let's find the right fit together.",
    },
  },
};

/** Display labels: convert IDs to natural language for the confirmation screen */
export const serviceDisplayLabels: Record<QualifierId, string> = {
  "marketing-website": "a new marketing website",
  "website-redesign": "a website redesign",
  "landing-page": "a landing page",
  "business-dashboard": "a business dashboard",
  "client-portal": "a client portal",
  "crm-system": "a CRM system",
  "ai-tools": "an AI-powered tool",
  "full-platform": "a full operations platform",
  ecommerce: "an e-commerce store",
};

export const priorityDisplayLabels: Record<string, string> = {
  design: "Design",
  speed: "Speed",
  budget: "Budget",
  realtime: "Real-time data",
  ux: "User experience",
  scale: "Scalability",
  control: "Control",
  portal: "Client experience",
  growth: "Growth",
  quality: "Quality",
};

export const timelineDisplayLabels: Record<TimelineId, string> = {
  asap: "ASAP",
  "2-4-weeks": "in 2-4 weeks",
  "5-6-weeks": "in 5-6 weeks",
  flexible: "flexible on timing",
};

/** Build intake form URL with concierge-captured data as query params */
export function buildIntakeUrl(
  service: QualifierId | null,
  priority: PriorityId | null,
  timeline: TimelineId | null,
  category: CategoryId | null,
): string {
  const params = new URLSearchParams();
  if (service) params.set("service", service);
  if (priority) params.set("priority", priority);
  if (timeline) params.set("timeline", timeline);
  if (category && !service) params.set("category", category);
  return `/intake?${params.toString()}`;
}
