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
    walkthrough: {
      tagline: "From blank page to business engine.",
      steps: [
        {
          phase: "Discovery",
          icon: "search",
          title: "Discovery & Strategy",
          description:
            "We dig into your business, your audience, and your competition. No guesswork — just data and direct conversation to understand exactly what your website needs to accomplish.",
          deliverables: [
            "Competitive analysis document",
            "Target audience profile",
            "Sitemap & content strategy",
            "Project timeline",
          ],
          duration: "1 week",
        },
        {
          phase: "Design",
          icon: "palette",
          title: "Design & Prototyping",
          description:
            "High-fidelity mockups of every page, tested against your brand guidelines. You review, we refine. Nothing moves to code until you approve the design.",
          deliverables: [
            "Desktop & mobile mockups",
            "Brand-aligned design system",
            "Interactive prototype",
            "Revision rounds",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Build",
          icon: "hammer",
          title: "Engineering & QA",
          description:
            "Custom code, not templates. Every component built for performance, accessibility, and SEO. Tested across browsers, devices, and screen readers.",
          deliverables: [
            "Responsive website code",
            "SEO meta & schema markup",
            "WCAG AA accessibility",
            "Performance optimization",
          ],
          duration: "2–3 weeks",
        },
        {
          phase: "Launch",
          icon: "rocket",
          title: "Launch & Go-Live",
          description:
            "Domain configuration, SSL certificates, analytics setup, and a final walkthrough with you before we flip the switch. Launch day is a team effort.",
          deliverables: [
            "Domain & SSL setup",
            "Analytics integration",
            "Launch-day checklist",
            "Client training session",
          ],
          duration: "2–3 days",
        },
        {
          phase: "Support",
          icon: "headphones",
          title: "Post-Launch Support",
          description:
            "We don't disappear after launch. Bug fixes, content updates, performance monitoring — your site stays healthy with dedicated post-launch support.",
          deliverables: [
            "30-day post-launch support",
            "Bug fix SLA",
            "Monthly maintenance options",
            "Priority support channel",
          ],
          duration: "Ongoing",
        },
      ],
      cta: "Start Your Website Project",
    },
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
    walkthrough: {
      tagline: "Your brand deserves better than 2018.",
      steps: [
        {
          phase: "Discovery",
          icon: "search",
          title: "Audit & Analysis",
          description:
            "We audit your current site — performance scores, SEO gaps, accessibility issues, and user pain points. We identify what to keep, what to cut, and what to rebuild from scratch.",
          deliverables: [
            "Full site audit report",
            "Performance benchmark",
            "SEO gap analysis",
            "Redesign roadmap",
          ],
          duration: "1 week",
        },
        {
          phase: "Design",
          icon: "palette",
          title: "Modern Redesign",
          description:
            "Fresh design direction that honors your brand while bringing it into 2026. Side-by-side comparisons so you can see the transformation before a single line of code is written.",
          deliverables: [
            "Before/after design comparisons",
            "Updated brand style guide",
            "Responsive mockups",
            "Stakeholder review session",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Build",
          icon: "hammer",
          title: "Rebuild & Migration",
          description:
            "Clean rebuild with modern technology. We migrate your content, preserve your SEO equity, and ensure zero downtime during the transition.",
          deliverables: [
            "Modern codebase rebuild",
            "Content migration",
            "SEO redirect mapping",
            "Cross-browser testing",
          ],
          duration: "2–4 weeks",
        },
        {
          phase: "Launch",
          icon: "rocket",
          title: "Seamless Cutover",
          description:
            "DNS switchover with zero downtime. We monitor the transition in real-time and validate every page loads correctly on the new build.",
          deliverables: [
            "Zero-downtime deployment",
            "301 redirect verification",
            "Performance validation",
            "Analytics continuity check",
          ],
          duration: "1–2 days",
        },
        {
          phase: "Support",
          icon: "headphones",
          title: "Post-Launch Monitoring",
          description:
            "We watch your new site like a hawk for the first 30 days — performance metrics, search ranking changes, and user behavior analytics.",
          deliverables: [
            "30-day performance monitoring",
            "Search ranking tracking",
            "Bug fix SLA",
            "Optimization recommendations",
          ],
          duration: "Ongoing",
        },
      ],
      cta: "Redesign Your Website",
    },
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
    walkthrough: {
      tagline: "One page. Maximum impact.",
      steps: [
        {
          phase: "Discovery",
          icon: "search",
          title: "Goal & Audience Mapping",
          description:
            "We define the single conversion goal, map your ideal visitor's journey, and research what messaging resonates with your market.",
          deliverables: [
            "Conversion goal definition",
            "Visitor journey map",
            "Messaging framework",
            "Competitor landing page analysis",
          ],
          duration: "3–4 days",
        },
        {
          phase: "Design",
          icon: "palette",
          title: "High-Conversion Layout",
          description:
            "Every section engineered for one purpose: getting the visitor to act. Hero, social proof, benefits, objection handling, and CTA — all strategically placed.",
          deliverables: [
            "Desktop & mobile mockup",
            "Copywriting framework",
            "CTA placement strategy",
            "A/B test variant concepts",
          ],
          duration: "3–5 days",
        },
        {
          phase: "Build",
          icon: "hammer",
          title: "Speed-Optimized Build",
          description:
            "Lightweight, blazing-fast code. Sub-2-second load times, optimized images, and pixel-perfect implementation of the approved design.",
          deliverables: [
            "Responsive landing page",
            "Lead capture form integration",
            "Speed optimization (<2s LCP)",
            "Tracking pixel setup",
          ],
          duration: "1 week",
        },
        {
          phase: "Launch",
          icon: "rocket",
          title: "Go Live & Track",
          description:
            "Domain setup, SSL, analytics, and conversion tracking all configured. We launch and immediately start measuring performance.",
          deliverables: [
            "Domain & SSL configuration",
            "Conversion tracking setup",
            "UTM parameter mapping",
            "Launch verification",
          ],
          duration: "1 day",
        },
        {
          phase: "Support",
          icon: "headphones",
          title: "Optimize & Iterate",
          description:
            "Post-launch, we review conversion data and recommend tweaks. Your landing page gets better with every visitor.",
          deliverables: [
            "14-day conversion report",
            "A/B test recommendations",
            "Copy & layout tweaks",
            "Performance monitoring",
          ],
          duration: "2 weeks",
        },
      ],
      cta: "Build Your Landing Page",
    },
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
    walkthrough: {
      tagline: "Your data, your way, in real time.",
      steps: [
        {
          phase: "Discovery",
          icon: "search",
          title: "Requirements & Data Mapping",
          description:
            "We map your data sources, identify key metrics, and define exactly what decisions the dashboard needs to support. No vanity metrics — only actionable intelligence.",
          deliverables: [
            "Data source inventory",
            "KPI definition document",
            "User role matrix",
            "Dashboard wireframe",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Design",
          icon: "palette",
          title: "Interface & Visualization Design",
          description:
            "Clean, intuitive layouts with the right chart types for your data. Every widget answers a specific business question at a glance.",
          deliverables: [
            "Dashboard UI mockups",
            "Chart & widget specifications",
            "Filter & drill-down flows",
            "Role-based view designs",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Build",
          icon: "hammer",
          title: "Development & Integration",
          description:
            "Secure backend APIs, real-time data pipelines, and a polished frontend. Role-based access ensures every user sees exactly what they need.",
          deliverables: [
            "Secure API layer",
            "Real-time data visualization",
            "Role-based access control",
            "Export & reporting features",
          ],
          duration: "3–5 weeks",
        },
        {
          phase: "Launch",
          icon: "rocket",
          title: "Deployment & Training",
          description:
            "We deploy to your infrastructure, configure SSL and security, and walk your team through every feature in a hands-on training session.",
          deliverables: [
            "Production deployment",
            "Security configuration",
            "Team training session",
            "User documentation",
          ],
          duration: "3–5 days",
        },
        {
          phase: "Support",
          icon: "headphones",
          title: "Monitoring & Evolution",
          description:
            "Dashboards evolve as your business grows. We monitor performance, add new widgets, and refine views based on how your team actually uses the tool.",
          deliverables: [
            "30-day performance monitoring",
            "Usage analytics review",
            "New widget requests",
            "Priority support channel",
          ],
          duration: "Ongoing",
        },
      ],
      cta: "Build Your Dashboard",
    },
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
    walkthrough: {
      tagline: "Give your clients the VIP experience.",
      steps: [
        {
          phase: "Discovery",
          icon: "search",
          title: "Client Journey Mapping",
          description:
            "We map every touchpoint in your client relationship — onboarding, updates, deliverables, payments — and design a portal that streamlines all of it.",
          deliverables: [
            "Client journey map",
            "Feature prioritization matrix",
            "Portal sitemap",
            "Integration requirements",
          ],
          duration: "1 week",
        },
        {
          phase: "Design",
          icon: "palette",
          title: "Branded Portal Design",
          description:
            "Your portal, your brand. Custom-designed interface that feels like an extension of your business — not a generic tool.",
          deliverables: [
            "Branded portal mockups",
            "Client dashboard layouts",
            "Notification & email templates",
            "Mobile-responsive designs",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Build",
          icon: "hammer",
          title: "Secure Development",
          description:
            "Authentication, encryption, role-based access — built from the ground up. Document sharing, messaging, project status, and invoicing all integrated into one platform.",
          deliverables: [
            "Secure authentication system",
            "Project & task tracking",
            "Document upload & sharing",
            "Invoice & payment integration",
          ],
          duration: "3–5 weeks",
        },
        {
          phase: "Launch",
          icon: "rocket",
          title: "Onboard & Activate",
          description:
            "We help you onboard your first clients into the portal. Branded invitation emails, guided setup, and a smooth first impression.",
          deliverables: [
            "Production deployment",
            "Client onboarding flow",
            "Invitation email system",
            "Admin training session",
          ],
          duration: "3–5 days",
        },
        {
          phase: "Support",
          icon: "headphones",
          title: "Grow & Refine",
          description:
            "As your client base grows, so does the portal. New features, performance optimization, and continuous refinement based on real client feedback.",
          deliverables: [
            "30-day post-launch support",
            "Client feedback integration",
            "Feature enhancement roadmap",
            "Priority support channel",
          ],
          duration: "Ongoing",
        },
      ],
      cta: "Build Your Client Portal",
    },
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
    walkthrough: {
      tagline: "Built to sell, not just to display.",
      steps: [
        {
          phase: "Discovery",
          icon: "search",
          title: "Product & Market Strategy",
          description:
            "We analyze your products, pricing, competitors, and target customer. Every design decision is backed by understanding who buys from you and why.",
          deliverables: [
            "Product catalog structure",
            "Customer persona profiles",
            "Competitor storefront analysis",
            "Conversion strategy document",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Design",
          icon: "palette",
          title: "Storefront & Checkout Design",
          description:
            "Product pages that convert, a checkout flow that doesn't leak — every screen designed to minimize friction and maximize sales.",
          deliverables: [
            "Storefront page mockups",
            "Product detail page designs",
            "Cart & checkout flow",
            "Mobile shopping experience",
          ],
          duration: "2–3 weeks",
        },
        {
          phase: "Build",
          icon: "hammer",
          title: "Store Engineering",
          description:
            "Payment processing, inventory management, order tracking, and customer accounts — all custom-built with security and speed at the core.",
          deliverables: [
            "Payment gateway integration",
            "Inventory management system",
            "Order tracking & notifications",
            "Customer account portal",
          ],
          duration: "4–6 weeks",
        },
        {
          phase: "Launch",
          icon: "rocket",
          title: "Store Launch",
          description:
            "Final testing with real transactions, product catalog loaded, shipping configured, and analytics armed. Your store opens for business.",
          deliverables: [
            "Payment testing & verification",
            "Product catalog import",
            "Shipping configuration",
            "E-commerce analytics setup",
          ],
          duration: "3–5 days",
        },
        {
          phase: "Support",
          icon: "headphones",
          title: "Optimize & Scale",
          description:
            "Post-launch conversion analysis, A/B testing, and performance tuning. As your catalog and traffic grow, your store scales with it.",
          deliverables: [
            "30-day sales analytics",
            "Conversion rate optimization",
            "Catalog expansion support",
            "Priority support channel",
          ],
          duration: "Ongoing",
        },
      ],
      cta: "Launch Your Store",
    },
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
    walkthrough: {
      tagline: "Every lead tracked. Every deal closed.",
      steps: [
        {
          phase: "Discovery",
          icon: "search",
          title: "Workflow & Pipeline Mapping",
          description:
            "We map your entire sales process — lead sources, qualification steps, handoff points, and follow-up cadences. Your CRM will mirror exactly how your team sells.",
          deliverables: [
            "Sales process flowchart",
            "Pipeline stage definitions",
            "Lead scoring criteria",
            "Integration requirements",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Design",
          icon: "palette",
          title: "CRM Interface Design",
          description:
            "Kanban boards, list views, detail pages, and dashboards — designed for speed. Your team should be able to update a deal status in two clicks.",
          deliverables: [
            "Pipeline board mockups",
            "Contact & deal detail pages",
            "Dashboard & reporting views",
            "Mobile CRM layouts",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Build",
          icon: "hammer",
          title: "CRM Development",
          description:
            "Database schema, API layer, pipeline logic, automated follow-ups, and a polished frontend. Built to handle thousands of contacts without breaking a sweat.",
          deliverables: [
            "Contact & deal management",
            "Pipeline automation",
            "Email integration",
            "Reporting & analytics engine",
          ],
          duration: "4–6 weeks",
        },
        {
          phase: "Launch",
          icon: "rocket",
          title: "Migration & Training",
          description:
            "We migrate your existing contacts, set up automations, and train your team in a hands-on session. You're productive from day one.",
          deliverables: [
            "Data migration from existing tools",
            "Automation configuration",
            "Team training session",
            "Quick-start documentation",
          ],
          duration: "3–5 days",
        },
        {
          phase: "Support",
          icon: "headphones",
          title: "Evolve & Expand",
          description:
            "As your sales process matures, so does your CRM. New automations, integrations, and reports added as your business demands them.",
          deliverables: [
            "30-day post-launch support",
            "Automation refinement",
            "New integration requests",
            "Priority support channel",
          ],
          duration: "Ongoing",
        },
      ],
      cta: "Build Your CRM",
    },
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
    walkthrough: {
      tagline: "One platform to run your entire business.",
      steps: [
        {
          phase: "Discovery",
          icon: "search",
          title: "Operations Deep Dive",
          description:
            "We audit every system your business touches — sales, operations, client management, billing, communication. Then we design a unified platform that replaces them all.",
          deliverables: [
            "Systems audit & gap analysis",
            "Unified platform architecture",
            "Data flow diagram",
            "Phased delivery roadmap",
          ],
          duration: "2–3 weeks",
        },
        {
          phase: "Design",
          icon: "palette",
          title: "Platform UI/UX Design",
          description:
            "Every module — website, CRM, portal, invoicing — designed as one cohesive experience. Consistent navigation, shared design language, and role-based views.",
          deliverables: [
            "Module-by-module mockups",
            "Unified design system",
            "Role-based view designs",
            "Client portal experience",
          ],
          duration: "2–4 weeks",
        },
        {
          phase: "Build",
          icon: "hammer",
          title: "Platform Engineering",
          description:
            "Full-stack development in phases. Each module built, tested, and delivered incrementally so you get value from day one — not just at the end.",
          deliverables: [
            "Public website module",
            "CRM & pipeline module",
            "Client portal module",
            "Invoicing & payments module",
          ],
          duration: "8–14 weeks",
        },
        {
          phase: "Launch",
          icon: "rocket",
          title: "Phased Rollout",
          description:
            "We don't flip one switch — we roll out module by module, training your team on each before moving to the next. Controlled, confident, zero chaos.",
          deliverables: [
            "Module-by-module deployment",
            "Data migration per module",
            "Team training per module",
            "Go-live verification",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Support",
          icon: "headphones",
          title: "Dedicated Partnership",
          description:
            "A platform this comprehensive deserves ongoing partnership. Dedicated support, feature development, and strategic reviews to keep your business ahead.",
          deliverables: [
            "Dedicated support channel",
            "Monthly platform reviews",
            "Feature development retainer",
            "Performance optimization",
          ],
          duration: "Ongoing",
        },
      ],
      cta: "Build Your Platform",
    },
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
    walkthrough: {
      tagline: "AI that works for your business, not the other way around.",
      steps: [
        {
          phase: "Discovery",
          icon: "search",
          title: "AI Opportunity Assessment",
          description:
            "We identify where AI can create real value in your business — not hype, not gimmicks. Concrete use cases with measurable ROI projections.",
          deliverables: [
            "AI opportunity matrix",
            "Use case prioritization",
            "ROI projection per use case",
            "Data readiness assessment",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Design",
          icon: "palette",
          title: "AI Experience Design",
          description:
            "How will your team and customers interact with AI? We design the interface, prompts, guardrails, and human review gates to ensure reliable, trustworthy results.",
          deliverables: [
            "AI interaction flow designs",
            "Prompt engineering strategy",
            "Human review gate definitions",
            "Responsible AI policy draft",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Build",
          icon: "hammer",
          title: "AI Development & Training",
          description:
            "Custom AI pipeline — from data ingestion to model integration to polished UI. Every output is validated, every edge case handled, every failure graceful.",
          deliverables: [
            "AI pipeline architecture",
            "Model integration & testing",
            "Output validation layer",
            "Admin monitoring dashboard",
          ],
          duration: "4–8 weeks",
        },
        {
          phase: "Launch",
          icon: "rocket",
          title: "Controlled Rollout",
          description:
            "AI tools launch in controlled stages — small team first, then wider rollout. We monitor outputs, accuracy, and user adoption at every step.",
          deliverables: [
            "Staged rollout plan",
            "Accuracy benchmarks",
            "Team training & documentation",
            "Monitoring & alerting setup",
          ],
          duration: "1–2 weeks",
        },
        {
          phase: "Support",
          icon: "headphones",
          title: "Monitor & Improve",
          description:
            "AI gets smarter over time — with the right feedback loops. We monitor performance, refine prompts, and expand capabilities as your confidence grows.",
          deliverables: [
            "Ongoing accuracy monitoring",
            "Prompt refinement cycles",
            "Feature expansion roadmap",
            "Responsible AI compliance",
          ],
          duration: "Ongoing",
        },
      ],
      cta: "Explore AI for Your Business",
    },
  },
];
