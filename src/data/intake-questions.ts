/**
 * Service-specific intake question modules.
 *
 * Each service has 8-12 deep, meaningful questions structured around:
 *   1. Your Business - who you are, who your customers are
 *   2. The Problem - what's not working, what you've tried
 *   3. The Vision - what success looks like, what changes
 *   4. Project Specifics - service-specific technical needs
 *
 * These questions are designed to build a complete picture of the client,
 * their business, and how we can deliver real impact - not just specs.
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
/*  1. Marketing Website                                               */
/* ------------------------------------------------------------------ */

const marketingWebsite: ServiceModule = {
  serviceId: "marketing-website",
  serviceLabel: "Marketing Website",
  icon: "Globe",
  tagline: "Tell us about your business - we'll build the website it deserves.",
  questions: [
    // Your Business
    {
      id: "aboutBusiness",
      label: "Tell us about your business - what do you do and who do you serve?",
      type: "textarea",
      placeholder:
        "What you offer, your story, the kind of people or businesses you help...",
      required: true,
      helpText: "The more we understand your business, the better we represent it.",
    },
    {
      id: "idealCustomer",
      label: "Who is your ideal customer? Describe the person who needs you most.",
      type: "textarea",
      placeholder:
        "Their age range, lifestyle, problems they face, where they look for solutions...",
      required: true,
    },
    {
      id: "uniqueAdvantage",
      label: "What makes your business different from competitors in your area?",
      type: "textarea",
      placeholder:
        "Your unique strengths, approach, experience, guarantees, personality...",
      required: true,
    },
    // The Problem
    {
      id: "currentChallenge",
      label: "What's not working about how you attract customers today?",
      type: "textarea",
      placeholder:
        "No online presence, outdated website, relying on word-of-mouth only, not showing up on Google...",
      required: true,
    },
    {
      id: "previousWebsite",
      label: "Have you had a website before? If so, what didn't work about it?",
      type: "textarea",
      placeholder:
        "Hard to update, didn't get traffic, looked unprofessional, didn't represent your brand...",
      required: false,
    },
    // The Vision
    {
      id: "successVision",
      label:
        "If your new website worked perfectly, what would change for your business in 6 months?",
      type: "textarea",
      placeholder:
        "More leads, less time explaining services, clients booking directly, professional credibility...",
      required: true,
    },
    // Project Specifics
    {
      id: "primaryCta",
      label: "What's the primary action you want visitors to take?",
      type: "radio",
      required: true,
      options: [
        { value: "call", label: "Call or text you" },
        { value: "form", label: "Fill out a contact or quote form" },
        { value: "book", label: "Book an appointment online" },
        { value: "buy", label: "Purchase a product or service" },
        { value: "learn", label: "Learn about your services first" },
      ],
    },
    {
      id: "pageEstimate",
      label: "How many pages do you envision?",
      type: "radio",
      required: true,
      options: [
        { value: "1-3", label: "1-3 (simple - Home, About, Contact)" },
        { value: "4-7", label: "4-7 (standard - Home, About, Services, Portfolio, Contact)" },
        { value: "8-15", label: "8-15 (comprehensive)" },
        { value: "15+", label: "15+ (large site)" },
        { value: "unsure", label: "Not sure - help me decide" },
      ],
    },
    {
      id: "contentReady",
      label: "Do you have content ready (copy, photos, branding)?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes - all ready to go" },
        { value: "some", label: "Some - need help with the rest" },
        { value: "no", label: "No - starting from scratch" },
      ],
    },
    {
      id: "inspirationSites",
      label:
        "Share any websites you admire - we want to understand your taste.",
      type: "textarea",
      placeholder:
        "URLs and what you like about them (design, feel, functionality)...",
      required: false,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  2. Website Redesign                                                */
/* ------------------------------------------------------------------ */

const websiteRedesign: ServiceModule = {
  serviceId: "website-redesign",
  serviceLabel: "Website Redesign",
  icon: "RefreshCw",
  tagline: "Let's turn what's broken into something that works for you.",
  questions: [
    // Your Business
    {
      id: "aboutBusiness",
      label:
        "Tell us about your business - what do you do, and how has it evolved since your current site was built?",
      type: "textarea",
      placeholder:
        "New services, new audience, rebranding, growth that outpaced your site...",
      required: true,
    },
    {
      id: "audienceShift",
      label:
        "Has your target customer changed since your current site launched?",
      type: "textarea",
      placeholder:
        "Serving a different market now, expanded offerings, shifted focus...",
      required: false,
    },
    // The Problem
    {
      id: "currentSiteUrl",
      label: "What is your current website URL?",
      type: "url",
      placeholder: "https://yoursite.com",
      required: true,
    },
    {
      id: "biggestFrustration",
      label:
        "What frustrates you most about your current website?",
      type: "textarea",
      placeholder:
        "Outdated look, slow, hard to update, doesn't convert, embarrassing to share...",
      required: true,
    },
    {
      id: "whatVisitorsSay",
      label:
        "What feedback have you gotten from customers about your site?",
      type: "textarea",
      placeholder:
        "Confusing navigation, can't find info, doesn't work on phone, looks old...",
      required: false,
    },
    // The Vision
    {
      id: "successVision",
      label:
        "What does your dream website do for your business that your current one doesn't?",
      type: "textarea",
      placeholder:
        "Brings in leads, makes you look professional, lets clients self-serve, ranks on Google...",
      required: true,
    },
    {
      id: "keepOrScrap",
      label:
        "Is there anything on your current site that IS working and should be kept?",
      type: "textarea",
      placeholder:
        "Certain pages, content, features, SEO rankings you want to preserve...",
      required: false,
    },
    // Project Specifics
    {
      id: "contentStrategy",
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
      id: "newFeatures",
      label: "Any new pages or features you want to add?",
      type: "textarea",
      placeholder:
        "Online booking, portfolio gallery, client login, blog, reviews section...",
      required: false,
    },
    {
      id: "analyticsData",
      label: "Do you have Google Analytics or traffic data we can review?",
      type: "radio",
      required: false,
      options: [
        { value: "yes-access", label: "Yes, and I can share access" },
        { value: "yes-no-access", label: "Yes, but not sure how to share" },
        { value: "no", label: "No analytics set up" },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  3. Landing Page                                                    */
/* ------------------------------------------------------------------ */

const landingPage: ServiceModule = {
  serviceId: "landing-page",
  serviceLabel: "Landing Page",
  icon: "Target",
  tagline: "One page, one goal - let's make it convert.",
  questions: [
    // Your Business
    {
      id: "aboutBusiness",
      label:
        "Tell us about your business and the specific offer this landing page is for.",
      type: "textarea",
      placeholder:
        "What you're selling or promoting, who it's for, why it matters...",
      required: true,
    },
    {
      id: "idealCustomer",
      label:
        "Who is the exact person you're trying to reach with this page?",
      type: "textarea",
      placeholder:
        "Their situation, what they're searching for, what would stop them from buying...",
      required: true,
    },
    // The Problem
    {
      id: "currentConversion",
      label:
        "How are you currently getting this offer in front of people? What's not working?",
      type: "textarea",
      placeholder:
        "Ads that don't convert, homepage that tries to do too much, no dedicated page...",
      required: true,
    },
    // The Vision
    {
      id: "successMetric",
      label:
        "If this landing page crushed it, what does that look like? What numbers matter?",
      type: "textarea",
      placeholder:
        "X signups per day, X% conversion rate, X calls booked per week...",
      required: true,
    },
    {
      id: "uniqueValue",
      label:
        "What makes your offer unique? Why should someone choose you over alternatives?",
      type: "textarea",
      placeholder:
        "Your competitive advantage, guarantees, results you deliver...",
      required: true,
    },
    // Project Specifics
    {
      id: "desiredAction",
      label: "What is the ONE action you want visitors to take?",
      type: "radio",
      required: true,
      options: [
        { value: "signup", label: "Sign up or register" },
        { value: "purchase", label: "Make a purchase" },
        { value: "book-call", label: "Book a call or demo" },
        { value: "download", label: "Download a resource" },
        { value: "contact", label: "Submit a contact form" },
      ],
    },
    {
      id: "trafficSource",
      label: "Where will traffic come from?",
      type: "checkbox",
      required: true,
      options: [
        { value: "google-ads", label: "Google Ads" },
        { value: "facebook-ads", label: "Facebook / Instagram Ads" },
        { value: "email", label: "Email campaigns" },
        { value: "social-organic", label: "Organic social media" },
        { value: "seo", label: "Organic search (SEO)" },
        { value: "referral", label: "Referral links" },
      ],
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
        { value: "numbers", label: "Stats (clients served, years in business)" },
        { value: "none", label: "Not yet - need help building credibility" },
      ],
    },
    {
      id: "existingFunnel",
      label: "Does this connect to an existing sales funnel or process?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes - it feeds into an existing process" },
        { value: "no", label: "No - this is standalone" },
        { value: "building", label: "I'm building the funnel now" },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  4. Business Dashboard                                              */
/* ------------------------------------------------------------------ */

const businessDashboard: ServiceModule = {
  serviceId: "business-dashboard",
  serviceLabel: "Business Dashboard",
  icon: "BarChart3",
  tagline: "Let's build the cockpit your business needs.",
  questions: [
    // Your Business
    {
      id: "aboutBusiness",
      label:
        "Walk us through your business - what do you do and how does your team operate day to day?",
      type: "textarea",
      placeholder:
        "Your industry, services, team structure, how decisions get made...",
      required: true,
    },
    {
      id: "decisionMakers",
      label:
        "Who needs to see data to make decisions, and what kind of decisions?",
      type: "textarea",
      placeholder:
        "CEO needs revenue trends, ops manager needs project status, sales needs pipeline...",
      required: true,
    },
    // The Problem
    {
      id: "currentProcess",
      label:
        "How do you currently track your key numbers? What's falling through the cracks?",
      type: "textarea",
      placeholder:
        "Spreadsheets, manual reports, gut feeling, no visibility into...",
      required: true,
    },
    {
      id: "biggestBlindSpot",
      label:
        "What question about your business can you never get a quick answer to?",
      type: "textarea",
      placeholder:
        "How much did we make last month? Which clients are overdue? Where are we losing time?",
      required: true,
    },
    // The Vision
    {
      id: "successVision",
      label:
        "If you could open this dashboard every morning and see exactly what you need - what would that look like?",
      type: "textarea",
      placeholder:
        "The metrics, the layout, the feeling of being in control...",
      required: true,
    },
    // Project Specifics
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
      ],
    },
    {
      id: "rbacNeeded",
      label: "Do different users need to see different data?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes - role-based access needed" },
        { value: "no", label: "No - everyone sees the same data" },
        { value: "unsure", label: "Not sure yet" },
      ],
    },
    {
      id: "mobileAccess",
      label: "Do users need mobile access?",
      type: "radio",
      required: true,
      options: [
        { value: "critical", label: "Yes - mobile is critical" },
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
  ],
};

/* ------------------------------------------------------------------ */
/*  5. Client Portal                                                   */
/* ------------------------------------------------------------------ */

const clientPortal: ServiceModule = {
  serviceId: "client-portal",
  serviceLabel: "Client Portal",
  icon: "Users",
  tagline: "Give your clients an experience that builds trust.",
  questions: [
    // Your Business
    {
      id: "aboutBusiness",
      label:
        "Tell us about your business - what do you do and how do you work with clients?",
      type: "textarea",
      placeholder:
        "Your services, how long client engagements last, what the relationship looks like...",
      required: true,
    },
    {
      id: "clientRelationship",
      label:
        "Describe a typical client engagement from start to finish.",
      type: "textarea",
      placeholder:
        "First contact, onboarding, deliverables, communication, wrap-up...",
      required: true,
    },
    // The Problem
    {
      id: "currentCommunication",
      label:
        "How do you currently communicate with clients? What's messy about it?",
      type: "textarea",
      placeholder:
        "Emails get lost, files scattered across platforms, clients asking for updates constantly...",
      required: true,
    },
    {
      id: "clientFrustration",
      label:
        "What do your clients complain about or struggle with in working with you?",
      type: "textarea",
      placeholder:
        "Hard to find documents, don't know project status, payment confusion, too many emails...",
      required: false,
    },
    // The Vision
    {
      id: "successVision",
      label:
        "If your clients had a perfect portal, what would change about your relationship with them?",
      type: "textarea",
      placeholder:
        "Less back-and-forth, more trust, faster payments, clients refer you more...",
      required: true,
    },
    // Project Specifics
    {
      id: "portalFeatures",
      label: "What do your clients need to see or do in the portal?",
      type: "checkbox",
      required: true,
      options: [
        { value: "project-status", label: "View project status and progress" },
        { value: "documents", label: "Access shared documents and files" },
        { value: "messaging", label: "Send messages and communicate" },
        { value: "invoices", label: "View and pay invoices" },
        { value: "appointments", label: "Book appointments" },
        { value: "reports", label: "View reports or deliverables" },
        { value: "support", label: "Submit support requests" },
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
      id: "paymentPortal",
      label: "Should clients be able to view and pay invoices through the portal?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes - online payment required" },
        { value: "view-only", label: "View invoices but pay separately" },
        { value: "no", label: "No invoicing in the portal" },
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

/* ------------------------------------------------------------------ */
/*  6. E-Commerce                                                      */
/* ------------------------------------------------------------------ */

const ecommerce: ServiceModule = {
  serviceId: "ecommerce",
  serviceLabel: "E-Commerce",
  icon: "ShoppingCart",
  tagline: "Let's build a store your customers love buying from.",
  questions: [
    // Your Business
    {
      id: "aboutBusiness",
      label:
        "Tell us about your business - what do you sell and what's the story behind it?",
      type: "textarea",
      placeholder:
        "Your products, your brand story, why customers choose you...",
      required: true,
    },
    {
      id: "idealCustomer",
      label:
        "Who is your ideal buyer? Where do they shop now and what do they care about?",
      type: "textarea",
      placeholder:
        "Demographics, shopping habits, what they value (price, quality, sustainability, convenience)...",
      required: true,
    },
    // The Problem
    {
      id: "currentSelling",
      label:
        "How are you currently selling? What's not working about it?",
      type: "textarea",
      placeholder:
        "In-person only, marketplace fees too high, no online presence, current store is clunky...",
      required: true,
    },
    // The Vision
    {
      id: "successVision",
      label:
        "If your online store worked perfectly, what would your business look like in a year?",
      type: "textarea",
      placeholder:
        "Revenue goal, number of orders per day, new markets reached, less manual work...",
      required: true,
    },
    // Project Specifics
    {
      id: "productType",
      label: "What types of products do you sell?",
      type: "checkbox",
      required: true,
      options: [
        { value: "physical", label: "Physical products (shipped)" },
        { value: "digital", label: "Digital products (downloads)" },
        { value: "services", label: "Services (booked or scheduled)" },
        { value: "subscriptions", label: "Subscriptions or memberships" },
      ],
    },
    {
      id: "productCount",
      label: "How many products or SKUs do you have?",
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
      ],
    },
    {
      id: "shippingNeeds",
      label: "What are your shipping requirements?",
      type: "checkbox",
      required: false,
      options: [
        { value: "flat-rate", label: "Flat rate shipping" },
        { value: "calculated", label: "Calculated by weight or location" },
        { value: "free-threshold", label: "Free shipping over a certain amount" },
        { value: "local-pickup", label: "Local pickup option" },
        { value: "not-applicable", label: "Not applicable (digital products)" },
      ],
    },
    {
      id: "productPhotos",
      label: "Do you have professional product photos?",
      type: "radio",
      required: true,
      options: [
        { value: "yes-all", label: "Yes, all products photographed" },
        { value: "yes-some", label: "Some - need help with the rest" },
        { value: "no", label: "No professional photos yet" },
      ],
    },
    {
      id: "mostImportant",
      label:
        "What's the most important thing we get right about your store?",
      type: "textarea",
      placeholder:
        "Beautiful design, fast checkout, mobile experience, SEO, trust signals...",
      required: true,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  7. CRM System                                                      */
/* ------------------------------------------------------------------ */

const crmSystem: ServiceModule = {
  serviceId: "crm-system",
  serviceLabel: "CRM System",
  icon: "Contact",
  tagline: "Let's build the system that keeps your deals moving.",
  questions: [
    // Your Business
    {
      id: "aboutBusiness",
      label:
        "Walk us through your business - what do you do and how do you find clients?",
      type: "textarea",
      placeholder:
        "Your services, how leads come in, your sales process...",
      required: true,
    },
    // The Problem
    {
      id: "currentTracking",
      label:
        "How do you currently track leads and clients? What tools are you using?",
      type: "textarea",
      placeholder:
        "Spreadsheets, email inbox, phone notes, paper, existing CRM...",
      required: true,
    },
    {
      id: "fallingThroughCracks",
      label:
        "What's falling through the cracks? Where do you lose deals or forget follow-ups?",
      type: "textarea",
      placeholder:
        "Leads go cold, forget to follow up, no visibility into pipeline, lost contact info...",
      required: true,
    },
    // The Vision
    {
      id: "idealSalesProcess",
      label:
        "Describe your ideal sales process - from first contact to signed deal.",
      type: "textarea",
      placeholder:
        "Lead comes in → qualify → send proposal → follow up → close → onboard...",
      required: true,
    },
    {
      id: "successVision",
      label:
        "If this CRM worked perfectly, what would your business look like in a year?",
      type: "textarea",
      placeholder:
        "No lost leads, faster close rates, clear pipeline visibility, automated follow-ups...",
      required: true,
    },
    {
      id: "atAGlance",
      label:
        "What information do you need to see at a glance to make decisions?",
      type: "textarea",
      placeholder:
        "Pipeline value, deal stage, last contact date, overdue tasks, revenue forecast...",
      required: true,
    },
    // Project Specifics
    {
      id: "teamSize",
      label: "How many people on your team would use this system daily?",
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
      id: "emailIntegration",
      label: "Do you need email integration (sending and tracking from the CRM)?",
      type: "radio",
      required: true,
      options: [
        { value: "yes", label: "Yes - essential" },
        { value: "nice-to-have", label: "Nice to have" },
        { value: "no", label: "No" },
      ],
    },
    {
      id: "otherIntegrations",
      label: "What other tools does this need to connect with?",
      type: "textarea",
      placeholder:
        "Calendar, accounting software, phone system, marketing tools, website forms...",
      required: false,
    },
    {
      id: "mostImportant",
      label: "What's the most important thing we get right?",
      type: "textarea",
      placeholder:
        "Easy to use, mobile access, automation, reporting, speed...",
      required: true,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  8. Full Operations Platform                                        */
/* ------------------------------------------------------------------ */

const fullPlatform: ServiceModule = {
  serviceId: "full-platform",
  serviceLabel: "Full Operations Platform",
  icon: "Layers",
  tagline: "Tell us about your entire operation - we'll digitize it.",
  questions: [
    // Your Business
    {
      id: "aboutBusiness",
      label:
        "Walk us through your entire business operation - from how work comes in to how it gets delivered.",
      type: "textarea",
      placeholder:
        "Your services, team structure, workflow, how you manage projects, billing, communication...",
      required: true,
    },
    {
      id: "teamStructure",
      label:
        "How is your team structured? Who does what?",
      type: "textarea",
      placeholder:
        "Roles, departments, who needs access to what information...",
      required: true,
    },
    // The Problem
    {
      id: "biggestPainPoint",
      label:
        "What is your single biggest operational pain point right now?",
      type: "textarea",
      placeholder:
        "The one thing that wastes the most time, causes the most errors, or costs the most money...",
      required: true,
    },
    {
      id: "currentTools",
      label:
        "What tools are you currently using? List everything.",
      type: "textarea",
      placeholder:
        "Spreadsheets, QuickBooks, Google Drive, paper, sticky notes, email, apps...",
      required: true,
    },
    {
      id: "whatBreaks",
      label:
        "When things go wrong in your operations, what typically breaks down?",
      type: "textarea",
      placeholder:
        "Communication gaps, missed deadlines, billing errors, lost files, dropped clients...",
      required: true,
    },
    // The Vision
    {
      id: "successVision",
      label:
        "If we built you the perfect operations platform, what would your business look like in a year?",
      type: "textarea",
      placeholder:
        "Everything in one place, automated workflows, real-time visibility, no more fires to put out...",
      required: true,
    },
    // Project Specifics
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
      id: "clientFacing",
      label: "Do you need client-facing components (portal, booking, communication)?",
      type: "radio",
      required: true,
      options: [
        { value: "yes-essential", label: "Yes - essential for our clients" },
        { value: "yes-nice", label: "Nice to have" },
        { value: "internal-only", label: "No - internal tool only" },
      ],
    },
    {
      id: "migrationData",
      label: "Do you have existing data that needs to be migrated?",
      type: "radio",
      required: true,
      options: [
        { value: "yes-lots", label: "Yes - significant data to migrate" },
        { value: "yes-some", label: "Some data to import" },
        { value: "fresh-start", label: "Starting fresh" },
      ],
    },
    {
      id: "automationPriorities",
      label: "What would you automate first if you could?",
      type: "textarea",
      placeholder:
        "Client onboarding, invoice reminders, status updates, report generation, scheduling...",
      required: false,
    },
    {
      id: "mostImportant",
      label:
        "What's the most important thing we get right about this platform?",
      type: "textarea",
      placeholder:
        "Ease of use, reliability, speed, mobile access, all-in-one...",
      required: true,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  9. AI-Powered Tools                                                */
/* ------------------------------------------------------------------ */

const aiPoweredTools: ServiceModule = {
  serviceId: "ai-tools",
  serviceLabel: "AI-Powered Tools",
  icon: "Brain",
  tagline: "Tell us how AI can make your business smarter.",
  questions: [
    // Your Business
    {
      id: "aboutBusiness",
      label:
        "Tell us about your business - what do you do and who do you serve?",
      type: "textarea",
      placeholder:
        "Your industry, services, team size, the work that fills your days...",
      required: true,
    },
    // The Problem
    {
      id: "timeWasters",
      label:
        "What tasks eat up the most time in your business that feel repetitive or manual?",
      type: "textarea",
      placeholder:
        "Answering the same questions, writing emails, processing documents, data entry, research...",
      required: true,
    },
    {
      id: "aiTaskDescription",
      label: "What specific task do you want AI to help with?",
      type: "textarea",
      placeholder:
        "Customer support, content generation, document processing, data analysis, recommendations...",
      required: true,
    },
    // The Vision
    {
      id: "successVision",
      label:
        "If this AI tool worked perfectly, what would it free you up to do instead?",
      type: "textarea",
      placeholder:
        "Focus on clients, grow the business, reduce team workload, serve more customers...",
      required: true,
    },
    // Project Specifics
    {
      id: "aiUsers",
      label: "Who will use the AI tool?",
      type: "checkbox",
      required: true,
      options: [
        { value: "internal-team", label: "Internal team" },
        { value: "clients", label: "Your clients" },
        { value: "public", label: "General public (website visitors)" },
      ],
    },
    {
      id: "aiErrorConsequence",
      label: "What happens if the AI gives an incorrect answer?",
      type: "radio",
      required: true,
      options: [
        { value: "low-risk", label: "Low risk - minor inconvenience" },
        { value: "medium-risk", label: "Medium risk - could impact decisions" },
        { value: "high-risk", label: "High risk - financial, legal, or safety implications" },
      ],
    },
    {
      id: "humanReview",
      label: "Do you need human review before AI output goes live?",
      type: "radio",
      required: true,
      options: [
        { value: "always", label: "Yes - always review before publishing" },
        { value: "sometimes", label: "For high-stakes outputs only" },
        { value: "no", label: "No - fully automated is fine" },
      ],
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
    {
      id: "aiIntegrations",
      label: "Should the AI tool integrate with your existing systems?",
      type: "textarea",
      placeholder:
        "CRM, email, Slack, website, helpdesk, database...",
      required: false,
    },
    {
      id: "mostImportant",
      label: "What's the most important thing we get right about this tool?",
      type: "textarea",
      placeholder:
        "Accuracy, speed, ease of use, cost-effectiveness, trust...",
      required: true,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Export all modules                                                  */
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
