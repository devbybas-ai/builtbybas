/**
 * Service-specific intake question modules.
 *
 * Each service has a set of targeted questions designed to extract
 * every detail needed to build a tailored, perfect solution.
 */

export type QuestionType =
  | "text"
  | "textarea"
  | "radio"
  | "checkbox"
  | "url"
  | "number";

export interface IntakeQuestion {
  id: string;
  label: string;
  type: QuestionType;
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
  helpText?: string;
}

export interface ServiceModule {
  serviceId: string;
  serviceLabel: string;
  icon: string;
  tagline: string;
  questions: IntakeQuestion[];
}

/* ------------------------------------------------------------------ */
/*  Service Modules                                                    */
/* ------------------------------------------------------------------ */

const marketingWebsite: ServiceModule = {
  serviceId: "marketing-website",
  serviceLabel: "Marketing Website",
  icon: "Globe",
  tagline: "Tell us about the website that will grow your business.",
  questions: [
    {
      id: "primaryOffering",
      label: "What products or services does your business offer?",
      type: "textarea",
      placeholder:
        "Describe what you sell or provide — be as specific as possible",
      required: true,
    },
    {
      id: "targetAudience",
      label: "Who is your ideal customer?",
      type: "textarea",
      placeholder:
        "Demographics, location, behaviors — e.g., homeowners aged 30-55 in Miami",
      required: true,
    },
    {
      id: "primaryCta",
      label: "What action do you most want visitors to take?",
      type: "radio",
      required: true,
      options: [
        { value: "call", label: "Call or text you" },
        { value: "form", label: "Fill out a contact/quote form" },
        { value: "book", label: "Book an appointment online" },
        { value: "buy", label: "Purchase a product or service" },
        { value: "learn", label: "Learn about your services first" },
        { value: "other", label: "Something else" },
      ],
    },
    {
      id: "pageEstimate",
      label: "How many pages do you envision?",
      type: "radio",
      required: true,
      options: [
        { value: "1-3", label: "1-3 (simple — Home, About, Contact)" },
        {
          value: "4-7",
          label:
            "4-7 (standard — Home, About, Services, Portfolio, Contact, Blog)",
        },
        { value: "8-15", label: "8-15 (comprehensive)" },
        { value: "15+", label: "15+ (large site)" },
        { value: "unsure", label: "Not sure — help me decide" },
      ],
    },
    {
      id: "contentReady",
      label: "Do you have written content (copy) ready for the site?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes, all content is written and ready" },
        { value: "some", label: "Some content — need help with the rest" },
        { value: "no", label: "No — I need copywriting from scratch" },
      ],
    },
    {
      id: "blogNeeded",
      label: "Do you need a blog or news section?",
      type: "radio",
      required: true,
      options: [
        { value: "yes-regular", label: "Yes, I'll publish regularly" },
        { value: "yes-occasional", label: "Yes, but only occasionally" },
        { value: "no", label: "No blog needed" },
        { value: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "integrations",
      label: "What tools or platforms should the site integrate with?",
      type: "checkbox",
      required: false,
      options: [
        { value: "google-analytics", label: "Google Analytics" },
        { value: "google-business", label: "Google Business Profile" },
        { value: "email-marketing", label: "Email marketing (Mailchimp, etc.)" },
        { value: "booking", label: "Appointment booking" },
        { value: "payment", label: "Online payments" },
        { value: "social", label: "Social media feeds" },
        { value: "chat", label: "Live chat / chatbot" },
        { value: "crm", label: "CRM integration" },
        { value: "none", label: "None / not sure yet" },
      ],
    },
    {
      id: "seoFocus",
      label: "What's your SEO priority?",
      type: "radio",
      required: true,
      options: [
        { value: "local", label: "Local SEO (show up in my city/area)" },
        {
          value: "national",
          label: "National/regional visibility",
        },
        { value: "specific-keywords", label: "Rank for specific keywords" },
        { value: "not-priority", label: "SEO isn't a priority right now" },
      ],
    },
    {
      id: "testimonialsReviews",
      label: "Do you have testimonials or reviews to showcase?",
      type: "radio",
      required: false,
      options: [
        { value: "yes-many", label: "Yes, plenty" },
        { value: "yes-few", label: "A few" },
        { value: "no", label: "Not yet" },
      ],
    },
    {
      id: "competitorUrls",
      label: "Share 2-3 competitor websites (or sites you admire)",
      type: "textarea",
      placeholder: "URLs or business names — what do you like about them?",
      required: false,
    },
  ],
};

const websiteRedesign: ServiceModule = {
  serviceId: "website-redesign",
  serviceLabel: "Website Redesign",
  icon: "RefreshCw",
  tagline: "Help us understand what to keep, fix, and improve.",
  questions: [
    {
      id: "currentSiteUrl",
      label: "What is your current website URL?",
      type: "url",
      placeholder: "https://yoursite.com",
      required: true,
    },
    {
      id: "currentPlatform",
      label: "What platform is your current site built on?",
      type: "radio",
      required: true,
      options: [
        { value: "wix", label: "Wix" },
        { value: "squarespace", label: "Squarespace" },
        { value: "wordpress", label: "WordPress" },
        { value: "shopify", label: "Shopify" },
        { value: "godaddy", label: "GoDaddy Website Builder" },
        { value: "custom", label: "Custom built" },
        { value: "other", label: "Other / not sure" },
      ],
    },
    {
      id: "dislikesCurrent",
      label: "What specifically do you dislike about your current site?",
      type: "textarea",
      placeholder:
        "Looks outdated, slow loading, hard to update, doesn't get leads...",
      required: true,
    },
    {
      id: "keepFromCurrent",
      label: "What's working well that you want to keep?",
      type: "textarea",
      placeholder:
        "Any pages, features, content, or functionality you like",
      required: false,
    },
    {
      id: "topVisitorProblems",
      label:
        "What are the top problems your visitors have with the current site?",
      type: "textarea",
      placeholder:
        "Can't find info, confusing navigation, doesn't work on mobile...",
      required: true,
    },
    {
      id: "keepContent",
      label: "Do you want to keep your current content or need new copy?",
      type: "radio",
      required: true,
      options: [
        { value: "keep-all", label: "Keep most of the current content" },
        { value: "keep-some", label: "Keep some, rewrite the rest" },
        { value: "rewrite-all", label: "Start fresh with all new content" },
      ],
    },
    {
      id: "analyticsData",
      label: "Do you have Google Analytics or other traffic data?",
      type: "radio",
      required: false,
      options: [
        { value: "yes-access", label: "Yes, and I can share access" },
        { value: "yes-no-access", label: "Yes, but not sure how to share" },
        { value: "no", label: "No analytics set up" },
      ],
    },
    {
      id: "newFeatures",
      label: "Any new pages or features you want to add?",
      type: "textarea",
      placeholder:
        "Online booking, portfolio gallery, client login, blog, etc.",
      required: false,
    },
  ],
};

const landingPage: ServiceModule = {
  serviceId: "landing-page",
  serviceLabel: "Landing Page",
  icon: "Target",
  tagline: "Let's build a page that converts.",
  questions: [
    {
      id: "offerDescription",
      label: "What specific product, service, or offer is this landing page for?",
      type: "textarea",
      placeholder: "Describe the offer in detail — what are you selling or promoting?",
      required: true,
    },
    {
      id: "desiredAction",
      label: "What is the ONE action you want visitors to take?",
      type: "radio",
      required: true,
      options: [
        { value: "signup", label: "Sign up / register" },
        { value: "purchase", label: "Make a purchase" },
        { value: "book-call", label: "Book a call or demo" },
        { value: "download", label: "Download a resource" },
        { value: "contact", label: "Submit a contact form" },
        { value: "other", label: "Something else" },
      ],
    },
    {
      id: "trafficSource",
      label: "Where will traffic come from?",
      type: "checkbox",
      required: true,
      options: [
        { value: "google-ads", label: "Google Ads" },
        { value: "facebook-ads", label: "Facebook/Instagram Ads" },
        { value: "email", label: "Email campaigns" },
        { value: "social-organic", label: "Organic social media" },
        { value: "seo", label: "Organic search (SEO)" },
        { value: "referral", label: "Referral links" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "existingFunnel",
      label: "Does this connect to an existing sales funnel?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes — it feeds into an existing process" },
        { value: "no", label: "No — this is standalone" },
        { value: "building", label: "I'm building the funnel now" },
      ],
    },
    {
      id: "uniqueValue",
      label: "What makes your offer unique? Why should someone choose you?",
      type: "textarea",
      placeholder: "Your competitive advantage, guarantees, special features...",
      required: true,
    },
    {
      id: "socialProof",
      label: "Do you have social proof to include?",
      type: "checkbox",
      required: false,
      options: [
        { value: "testimonials", label: "Customer testimonials" },
        { value: "reviews", label: "Online reviews (Google, Yelp)" },
        { value: "case-studies", label: "Case studies or results" },
        { value: "media", label: "Press mentions" },
        { value: "numbers", label: "Stats (clients served, years in business)" },
        { value: "none", label: "Not yet" },
      ],
    },
    {
      id: "abTesting",
      label: "Do you need A/B testing capability?",
      type: "radio",
      required: false,
      options: [
        { value: "yes", label: "Yes — I want to test variations" },
        { value: "later", label: "Not now, but maybe later" },
        { value: "no", label: "No" },
      ],
    },
  ],
};

const businessDashboard: ServiceModule = {
  serviceId: "business-dashboard",
  serviceLabel: "Business Dashboard",
  icon: "BarChart3",
  tagline: "Tell us what data matters most to your team.",
  questions: [
    {
      id: "dashboardPurpose",
      label: "What will this dashboard be used for?",
      type: "textarea",
      placeholder:
        "Track sales, monitor operations, manage inventory, team performance...",
      required: true,
    },
    {
      id: "dashboardUsers",
      label: "Who will use this dashboard?",
      type: "checkbox",
      required: true,
      options: [
        { value: "executives", label: "Executives / owners" },
        { value: "managers", label: "Managers / team leads" },
        { value: "employees", label: "Employees / staff" },
        { value: "clients", label: "Clients (external)" },
        { value: "partners", label: "Partners / contractors" },
      ],
    },
    {
      id: "userCount",
      label: "How many people need access?",
      type: "radio",
      required: true,
      options: [
        { value: "1-5", label: "1-5 users" },
        { value: "6-20", label: "6-20 users" },
        { value: "21-50", label: "21-50 users" },
        { value: "50+", label: "50+ users" },
      ],
    },
    {
      id: "dataSources",
      label: "What data sources need to be connected?",
      type: "checkbox",
      required: true,
      options: [
        { value: "spreadsheets", label: "Spreadsheets (Excel, Google Sheets)" },
        { value: "database", label: "Existing database" },
        { value: "api", label: "Third-party APIs" },
        { value: "accounting", label: "Accounting software (QuickBooks, Xero)" },
        { value: "crm", label: "CRM system" },
        { value: "ecommerce", label: "E-commerce platform" },
        { value: "manual", label: "Manual data entry" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "keyMetrics",
      label: "What are the key metrics or KPIs you need to track?",
      type: "textarea",
      placeholder:
        "Revenue, lead count, conversion rates, inventory levels, response times...",
      required: true,
    },
    {
      id: "rbacNeeded",
      label: "Do different users need to see different data?",
      type: "radio",
      required: true,
      options: [
        {
          value: "yes",
          label: "Yes — role-based access control needed",
        },
        { value: "no", label: "No — everyone sees the same data" },
        { value: "unsure", label: "Not sure yet" },
      ],
    },
    {
      id: "mobileAccess",
      label: "Do users need mobile access?",
      type: "radio",
      required: true,
      options: [
        { value: "critical", label: "Yes — mobile is critical for my team" },
        { value: "nice-to-have", label: "Nice to have but not essential" },
        { value: "desktop-only", label: "Desktop only is fine" },
      ],
    },
    {
      id: "dataRefresh",
      label: "How often does the data need to update?",
      type: "radio",
      required: true,
      options: [
        { value: "realtime", label: "Real-time (live updates)" },
        { value: "hourly", label: "Every few hours" },
        { value: "daily", label: "Once a day" },
        { value: "manual", label: "When I trigger a refresh" },
      ],
    },
    {
      id: "reportingExport",
      label: "Do you need reporting or data export?",
      type: "checkbox",
      required: false,
      options: [
        { value: "pdf-reports", label: "PDF reports" },
        { value: "csv-export", label: "CSV/Excel export" },
        { value: "scheduled", label: "Scheduled email reports" },
        { value: "custom", label: "Custom report builder" },
        { value: "none", label: "Not needed" },
      ],
    },
  ],
};

const clientPortal: ServiceModule = {
  serviceId: "client-portal",
  serviceLabel: "Client Portal",
  icon: "Users",
  tagline: "Let's design the perfect experience for your clients.",
  questions: [
    {
      id: "portalPurpose",
      label: "What do your clients need to see or do in the portal?",
      type: "checkbox",
      required: true,
      options: [
        { value: "project-status", label: "View project status / progress" },
        { value: "documents", label: "Access shared documents / files" },
        { value: "messaging", label: "Send messages / communicate" },
        { value: "invoices", label: "View and pay invoices" },
        { value: "appointments", label: "Book appointments" },
        { value: "reports", label: "View reports or deliverables" },
        { value: "support", label: "Submit support requests" },
        { value: "other", label: "Something else" },
      ],
    },
    {
      id: "currentClientComm",
      label: "How do you currently communicate with clients?",
      type: "checkbox",
      required: true,
      options: [
        { value: "email", label: "Email" },
        { value: "phone", label: "Phone / text" },
        { value: "slack", label: "Slack / Teams" },
        { value: "social", label: "Social media DMs" },
        { value: "in-person", label: "In person" },
        { value: "spreadsheets", label: "Shared spreadsheets" },
      ],
    },
    {
      id: "documentSharing",
      label: "Do you need document sharing and storage?",
      type: "radio",
      required: true,
      options: [
        { value: "yes-upload-download", label: "Yes — both upload and download" },
        { value: "yes-download-only", label: "Yes — download only (you share, they view)" },
        { value: "no", label: "No document sharing needed" },
      ],
    },
    {
      id: "paymentPortal",
      label: "Should clients be able to view/pay invoices through the portal?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes — online payment required" },
        { value: "view-only", label: "View invoices but pay separately" },
        { value: "no", label: "No invoicing in the portal" },
      ],
    },
    {
      id: "activeClientCount",
      label: "How many active clients would use the portal?",
      type: "radio",
      required: true,
      options: [
        { value: "1-10", label: "1-10" },
        { value: "11-50", label: "11-50" },
        { value: "51-200", label: "51-200" },
        { value: "200+", label: "200+" },
      ],
    },
    {
      id: "portalBranding",
      label: "Should the portal match your brand or be white-labeled?",
      type: "radio",
      required: true,
      options: [
        { value: "branded", label: "Match my company brand" },
        { value: "white-label", label: "White-labeled (neutral branding)" },
        { value: "unsure", label: "Not sure" },
      ],
    },
    {
      id: "portalIntegrations",
      label: "What existing tools should the portal integrate with?",
      type: "textarea",
      placeholder:
        "QuickBooks, Google Drive, Calendly, project management tools...",
      required: false,
    },
  ],
};

const ecommerce: ServiceModule = {
  serviceId: "ecommerce",
  serviceLabel: "E-Commerce",
  icon: "ShoppingCart",
  tagline: "Let's build a store that sells.",
  questions: [
    {
      id: "productType",
      label: "What types of products do you sell?",
      type: "checkbox",
      required: true,
      options: [
        { value: "physical", label: "Physical products (shipped)" },
        { value: "digital", label: "Digital products (downloads)" },
        { value: "services", label: "Services (booked/scheduled)" },
        { value: "subscriptions", label: "Subscriptions / memberships" },
        { value: "mixed", label: "Mix of the above" },
      ],
    },
    {
      id: "productCount",
      label: "How many products/SKUs do you have?",
      type: "radio",
      required: true,
      options: [
        { value: "1-10", label: "1-10" },
        { value: "11-50", label: "11-50" },
        { value: "51-200", label: "51-200" },
        { value: "201-1000", label: "201-1,000" },
        { value: "1000+", label: "1,000+" },
      ],
    },
    {
      id: "sellInternational",
      label: "Do you sell internationally?",
      type: "radio",
      required: true,
      options: [
        { value: "domestic-only", label: "Domestic only (US)" },
        { value: "north-america", label: "US + Canada" },
        { value: "international", label: "International shipping" },
        { value: "digital-global", label: "Digital products — available globally" },
      ],
    },
    {
      id: "paymentMethods",
      label: "What payment methods do you need?",
      type: "checkbox",
      required: true,
      options: [
        { value: "credit-card", label: "Credit / debit cards" },
        { value: "paypal", label: "PayPal" },
        { value: "apple-pay", label: "Apple Pay / Google Pay" },
        { value: "afterpay", label: "Buy Now Pay Later (Afterpay, Klarna)" },
        { value: "invoice", label: "Invoice / Net terms (B2B)" },
        { value: "crypto", label: "Cryptocurrency" },
      ],
    },
    {
      id: "inventoryManagement",
      label: "Do you need inventory management?",
      type: "radio",
      required: true,
      options: [
        { value: "yes-complex", label: "Yes — multi-location or warehouse" },
        { value: "yes-simple", label: "Yes — simple stock tracking" },
        { value: "no", label: "No — digital/service products" },
      ],
    },
    {
      id: "shippingNeeds",
      label: "What are your shipping requirements?",
      type: "checkbox",
      required: false,
      options: [
        { value: "flat-rate", label: "Flat rate shipping" },
        { value: "calculated", label: "Calculated shipping (by weight/location)" },
        { value: "free-threshold", label: "Free shipping over a certain amount" },
        { value: "local-pickup", label: "Local pickup option" },
        { value: "same-day", label: "Same-day / express delivery" },
        { value: "not-applicable", label: "Not applicable (digital products)" },
      ],
    },
    {
      id: "subscriptionBilling",
      label: "Do you need recurring billing or subscriptions?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes — subscriptions are core to my business" },
        { value: "optional", label: "Optional add-on (subscribe & save)" },
        { value: "no", label: "No recurring billing" },
      ],
    },
    {
      id: "productPhotos",
      label: "Do you have professional product photos?",
      type: "radio",
      required: true,
      options: [
        { value: "yes-all", label: "Yes, all products photographed" },
        { value: "yes-some", label: "Some products — need help with rest" },
        { value: "no", label: "No professional photos yet" },
      ],
    },
    {
      id: "returnsPolicy",
      label: "Do you have a returns/refund policy?",
      type: "radio",
      required: false,
      options: [
        { value: "yes", label: "Yes — established policy" },
        { value: "need-help", label: "Need help creating one" },
        { value: "no-returns", label: "No returns (digital/custom products)" },
      ],
    },
  ],
};

const crmSystem: ServiceModule = {
  serviceId: "crm-system",
  serviceLabel: "CRM System",
  icon: "Contact",
  tagline: "Let's organize your client relationships.",
  questions: [
    {
      id: "currentProcess",
      label: "How do you currently manage client/contact information?",
      type: "checkbox",
      required: true,
      options: [
        { value: "spreadsheets", label: "Spreadsheets (Excel, Google Sheets)" },
        { value: "email", label: "Email inbox" },
        { value: "paper", label: "Paper / notebooks" },
        { value: "existing-crm", label: "Existing CRM (which one?)" },
        { value: "phone-notes", label: "Phone notes / texts" },
        { value: "nothing", label: "No organized system" },
      ],
    },
    {
      id: "contactVolume",
      label: "How many clients/contacts do you manage?",
      type: "radio",
      required: true,
      options: [
        { value: "1-50", label: "1-50" },
        { value: "51-200", label: "51-200" },
        { value: "201-1000", label: "201-1,000" },
        { value: "1000+", label: "1,000+" },
      ],
    },
    {
      id: "pipelineStages",
      label: "Describe your client journey — what stages does a client go through?",
      type: "textarea",
      placeholder:
        "e.g., Lead → Contacted → Quoted → Booked → Completed → Follow-up",
      required: true,
    },
    {
      id: "crmFeatures",
      label: "What features are most important to you?",
      type: "checkbox",
      required: true,
      options: [
        { value: "pipeline", label: "Visual pipeline / Kanban board" },
        { value: "notes", label: "Client notes and activity log" },
        { value: "email-integration", label: "Email integration" },
        { value: "tasks", label: "Task and reminder management" },
        { value: "scheduling", label: "Appointment scheduling" },
        { value: "invoicing", label: "Invoicing / billing" },
        { value: "reporting", label: "Reports and analytics" },
        { value: "mobile", label: "Mobile access" },
        { value: "automation", label: "Workflow automation" },
      ],
    },
    {
      id: "crmIntegrations",
      label: "What tools should the CRM integrate with?",
      type: "checkbox",
      required: false,
      options: [
        { value: "email-provider", label: "Email (Gmail, Outlook)" },
        { value: "calendar", label: "Calendar (Google, Outlook)" },
        { value: "accounting", label: "Accounting (QuickBooks, Xero)" },
        { value: "marketing", label: "Marketing tools (Mailchimp, etc.)" },
        { value: "phone", label: "Phone system / VoIP" },
        { value: "social", label: "Social media" },
        { value: "none", label: "None needed right now" },
      ],
    },
    {
      id: "teamSize",
      label: "How many team members need CRM access?",
      type: "radio",
      required: true,
      options: [
        { value: "just-me", label: "Just me" },
        { value: "2-5", label: "2-5 people" },
        { value: "6-15", label: "6-15 people" },
        { value: "15+", label: "15+ people" },
      ],
    },
    {
      id: "automationNeeds",
      label: "What would you automate if you could?",
      type: "textarea",
      placeholder:
        "Follow-up emails, appointment reminders, status updates, reports...",
      required: false,
    },
  ],
};

const fullPlatform: ServiceModule = {
  serviceId: "full-platform",
  serviceLabel: "Full Operations Platform",
  icon: "Layers",
  tagline: "Tell us about your entire operation — we'll digitize it.",
  questions: [
    {
      id: "businessProcesses",
      label: "What business processes need to be digitized?",
      type: "checkbox",
      required: true,
      options: [
        { value: "client-management", label: "Client / contact management" },
        { value: "project-tracking", label: "Project tracking" },
        { value: "invoicing", label: "Invoicing and billing" },
        { value: "scheduling", label: "Scheduling / appointments" },
        { value: "inventory", label: "Inventory management" },
        { value: "team-management", label: "Team / employee management" },
        { value: "reporting", label: "Reporting and analytics" },
        { value: "communication", label: "Client communication" },
        { value: "marketing", label: "Marketing automation" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "platformTeamSize",
      label: "How many team members will use the platform?",
      type: "radio",
      required: true,
      options: [
        { value: "1-5", label: "1-5" },
        { value: "6-20", label: "6-20" },
        { value: "21-50", label: "21-50" },
        { value: "50+", label: "50+" },
      ],
    },
    {
      id: "currentTools",
      label: "What tools are you currently using?",
      type: "textarea",
      placeholder:
        "List everything: spreadsheets, software, apps, paper processes...",
      required: true,
    },
    {
      id: "biggestPainPoint",
      label: "What is your single biggest operational pain point?",
      type: "textarea",
      placeholder: "The one thing that wastes the most time or causes the most errors",
      required: true,
    },
    {
      id: "clientFacing",
      label: "Do you need client-facing components (portal, booking)?",
      type: "radio",
      required: true,
      options: [
        { value: "yes-essential", label: "Yes — essential for our clients" },
        { value: "yes-nice", label: "Nice to have" },
        { value: "internal-only", label: "No — internal tool only" },
      ],
    },
    {
      id: "billingNeeds",
      label: "What are your invoicing/billing needs?",
      type: "checkbox",
      required: false,
      options: [
        { value: "create-invoices", label: "Create and send invoices" },
        { value: "online-payment", label: "Accept online payments" },
        { value: "recurring", label: "Recurring billing" },
        { value: "estimates", label: "Quotes / estimates" },
        { value: "expense-tracking", label: "Expense tracking" },
        { value: "accounting-sync", label: "Sync with accounting software" },
        { value: "not-needed", label: "Not needed" },
      ],
    },
    {
      id: "automationPriorities",
      label: "What would you automate first if you could?",
      type: "textarea",
      placeholder:
        "Client onboarding, invoice reminders, status updates, report generation...",
      required: false,
    },
    {
      id: "migrationData",
      label: "Do you have existing data that needs to be migrated?",
      type: "radio",
      required: true,
      options: [
        { value: "yes-lots", label: "Yes — significant data to migrate" },
        { value: "yes-some", label: "Some data to import" },
        { value: "fresh-start", label: "Starting fresh" },
      ],
    },
  ],
};

const aiPoweredTools: ServiceModule = {
  serviceId: "ai-tools",
  serviceLabel: "AI-Powered Tools",
  icon: "Brain",
  tagline: "Tell us how AI can work for your business.",
  questions: [
    {
      id: "aiTaskDescription",
      label: "What task do you want AI to help with?",
      type: "textarea",
      placeholder:
        "Customer support, content generation, data analysis, document processing...",
      required: true,
    },
    {
      id: "aiDataSource",
      label: "What data will the AI work with?",
      type: "checkbox",
      required: true,
      options: [
        { value: "text-documents", label: "Text documents / PDFs" },
        { value: "customer-data", label: "Customer data / conversations" },
        { value: "product-info", label: "Product information" },
        { value: "financial", label: "Financial data" },
        { value: "images", label: "Images / visual content" },
        { value: "web-content", label: "Web content / URLs" },
        { value: "other", label: "Other" },
      ],
    },
    {
      id: "aiUsers",
      label: "Who will use the AI tool?",
      type: "checkbox",
      required: true,
      options: [
        { value: "internal-team", label: "Internal team" },
        { value: "clients", label: "Your clients" },
        { value: "public", label: "General public" },
      ],
    },
    {
      id: "aiErrorConsequence",
      label: "What happens if the AI gives an incorrect answer?",
      type: "radio",
      required: true,
      options: [
        {
          value: "low-risk",
          label: "Low risk — minor inconvenience",
        },
        {
          value: "medium-risk",
          label: "Medium risk — could impact decisions",
        },
        {
          value: "high-risk",
          label:
            "High risk — financial, legal, or safety implications",
        },
      ],
    },
    {
      id: "humanReview",
      label: "Do you need human-in-the-loop review before AI output goes live?",
      type: "radio",
      required: true,
      options: [
        { value: "always", label: "Yes — always review before publishing" },
        { value: "sometimes", label: "For high-stakes outputs only" },
        { value: "no", label: "No — fully automated is fine" },
      ],
    },
    {
      id: "aiIntegrations",
      label: "Should the AI tool integrate with existing systems?",
      type: "textarea",
      placeholder:
        "CRM, email, Slack, website, helpdesk, etc.",
      required: false,
    },
    {
      id: "aiVolume",
      label: "How many AI interactions do you expect per day?",
      type: "radio",
      required: true,
      options: [
        { value: "1-10", label: "1-10" },
        { value: "11-100", label: "11-100" },
        { value: "101-1000", label: "101-1,000" },
        { value: "1000+", label: "1,000+" },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Export all modules                                                 */
/* ------------------------------------------------------------------ */

export const SERVICE_MODULES: ServiceModule[] = [
  marketingWebsite,
  websiteRedesign,
  landingPage,
  businessDashboard,
  clientPortal,
  ecommerce,
  crmSystem,
  fullPlatform,
  aiPoweredTools,
];

export function getServiceModule(serviceId: string): ServiceModule | undefined {
  return SERVICE_MODULES.find((m) => m.serviceId === serviceId);
}

export function getServiceModules(serviceIds: string[]): ServiceModule[] {
  return serviceIds
    .map((id) => SERVICE_MODULES.find((m) => m.serviceId === id))
    .filter((m): m is ServiceModule => m !== undefined);
}
