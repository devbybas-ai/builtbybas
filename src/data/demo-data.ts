// Static mock data for the public demo backend

export const demoStats = {
  totalSubmissions: 24,
  totalClients: 8,
  estimatedPipelineValue: "$126,000",
  avgComplexity: 6.2,
};

export const demoSubmissionTrend = { change: 18 };

export const demoComplexityDistribution = [
  { label: "Simple", count: 4, percentage: 17, color: "bg-emerald-500" },
  { label: "Moderate", count: 9, percentage: 37, color: "bg-amber-500" },
  { label: "Complex", count: 8, percentage: 33, color: "bg-orange-500" },
  { label: "Enterprise", count: 3, percentage: 13, color: "bg-red-500" },
];

export const demoServiceDemand = [
  { service: "Website", count: 9 },
  { service: "Web App", count: 6 },
  { service: "CRM / Dashboard", count: 4 },
  { service: "E-Commerce", count: 3 },
  { service: "Mobile App", count: 1 },
  { service: "API / Integration", count: 1 },
];

export const demoBudgetDistribution = [
  { label: "Under $2k", count: 3, percentage: 13 },
  { label: "$2k - $5k", count: 7, percentage: 29 },
  { label: "$5k - $10k", count: 8, percentage: 33 },
  { label: "$10k - $25k", count: 4, percentage: 17 },
  { label: "$25k+", count: 2, percentage: 8 },
];

export const demoIndustryDistribution = [
  { label: "Beauty & Wellness", count: 5 },
  { label: "Technology", count: 4 },
  { label: "Professional Services", count: 4 },
  { label: "Retail", count: 3 },
  { label: "Healthcare", count: 3 },
  { label: "Nonprofit", count: 2 },
  { label: "Real Estate", count: 2 },
  { label: "Food & Beverage", count: 1 },
];

export const demoRecentSubmissions = [
  {
    id: "demo-1",
    name: "Sarah Mitchell",
    company: "Bloom Wellness Studio",
    primaryService: "Website + Booking",
    estimatedInvestment: "$5,000 - $10,000",
    submittedAt: "2026-03-05T14:30:00Z",
    complexityLabel: "Moderate",
    priority: { score: 92, label: "High" },
  },
  {
    id: "demo-2",
    name: "Marcus Rivera",
    company: "Rivera Legal Group",
    primaryService: "Web App",
    estimatedInvestment: "$10,000 - $25,000",
    submittedAt: "2026-03-04T09:15:00Z",
    complexityLabel: "Complex",
    priority: { score: 87, label: "High" },
  },
  {
    id: "demo-3",
    name: "Keisha Odom",
    company: "Nourish Kitchen Co.",
    primaryService: "E-Commerce",
    estimatedInvestment: "$5,000 - $10,000",
    submittedAt: "2026-03-03T16:45:00Z",
    complexityLabel: "Moderate",
    priority: { score: 78, label: "Medium" },
  },
  {
    id: "demo-4",
    name: "David Chen",
    company: "Apex Consulting",
    primaryService: "CRM / Dashboard",
    estimatedInvestment: "$10,000 - $25,000",
    submittedAt: "2026-03-02T11:20:00Z",
    complexityLabel: "Complex",
    priority: { score: 74, label: "Medium" },
  },
  {
    id: "demo-5",
    name: "Jasmine Okafor",
    company: "Glow Beauty Bar",
    primaryService: "Website",
    estimatedInvestment: "$2,000 - $5,000",
    submittedAt: "2026-03-01T08:00:00Z",
    complexityLabel: "Simple",
    priority: { score: 65, label: "Medium" },
  },
];

export const demoRecentActivity = [
  {
    id: "act-1",
    fromStage: "proposal_sent" as const,
    toStage: "proposal_accepted" as const,
    note: "Sarah loved the proposal, ready to start",
    createdAt: "2026-03-05T16:00:00Z",
  },
  {
    id: "act-2",
    fromStage: "intake_review" as const,
    toStage: "discovery_call" as const,
    note: "Scheduled call for March 7",
    createdAt: "2026-03-04T10:30:00Z",
  },
  {
    id: "act-3",
    fromStage: "discovery_call" as const,
    toStage: "proposal_sent" as const,
    note: "Proposal delivered — $8,500 web app",
    createdAt: "2026-03-03T14:00:00Z",
  },
];

export type DemoClient = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  stage: string;
  totalProjects: number;
  totalRevenue: string;
  lastActivity: string;
};

export const demoClients: DemoClient[] = [
  {
    id: "c1",
    name: "Sarah Mitchell",
    company: "Bloom Wellness Studio",
    email: "sarah@bloomwellness.com",
    phone: "(555) 234-5678",
    industry: "Beauty & Wellness",
    stage: "Active",
    totalProjects: 2,
    totalRevenue: "$14,500",
    lastActivity: "2026-03-05",
  },
  {
    id: "c2",
    name: "Marcus Rivera",
    company: "Rivera Legal Group",
    email: "marcus@riveralegal.com",
    phone: "(555) 345-6789",
    industry: "Professional Services",
    stage: "Active",
    totalProjects: 1,
    totalRevenue: "$22,000",
    lastActivity: "2026-03-04",
  },
  {
    id: "c3",
    name: "Keisha Odom",
    company: "Nourish Kitchen Co.",
    email: "keisha@nourishkitchen.com",
    phone: "(555) 456-7890",
    industry: "Food & Beverage",
    stage: "Discovery",
    totalProjects: 0,
    totalRevenue: "$0",
    lastActivity: "2026-03-03",
  },
  {
    id: "c4",
    name: "David Chen",
    company: "Apex Consulting",
    email: "david@apexconsulting.com",
    phone: "(555) 567-8901",
    industry: "Technology",
    stage: "Proposal",
    totalProjects: 1,
    totalRevenue: "$24,000",
    lastActivity: "2026-03-02",
  },
  {
    id: "c5",
    name: "Jasmine Okafor",
    company: "Glow Beauty Bar",
    email: "jasmine@glowbeautybar.com",
    phone: "(555) 678-9012",
    industry: "Beauty & Wellness",
    stage: "Active",
    totalProjects: 1,
    totalRevenue: "$7,500",
    lastActivity: "2026-03-01",
  },
  {
    id: "c6",
    name: "Tom Nakamura",
    company: "Greenfield Realty",
    email: "tom@greenfieldrealty.com",
    phone: "(555) 789-0123",
    industry: "Real Estate",
    stage: "Completed",
    totalProjects: 1,
    totalRevenue: "$12,000",
    lastActivity: "2026-02-20",
  },
  {
    id: "c7",
    name: "Amara Diallo",
    company: "Uplift Nonprofit",
    email: "amara@upliftnp.org",
    phone: "(555) 890-1234",
    industry: "Nonprofit",
    stage: "Active",
    totalProjects: 1,
    totalRevenue: "$9,500",
    lastActivity: "2026-02-28",
  },
  {
    id: "c8",
    name: "Rachel Simmons",
    company: "Luxe Hair Lounge",
    email: "rachel@luxehairlounge.com",
    phone: "(555) 901-2345",
    industry: "Beauty & Wellness",
    stage: "Completed",
    totalProjects: 1,
    totalRevenue: "$8,500",
    lastActivity: "2026-03-01",
  },
];

export type DemoPipelineCard = {
  id: string;
  name: string;
  company: string;
  service: string;
  value: string;
  priority: number;
  daysInStage: number;
};

export const demoPipelineStages: {
  id: string;
  label: string;
  cards: DemoPipelineCard[];
}[] = [
  {
    id: "intake_review",
    label: "Intake Review",
    cards: [
      { id: "p1", name: "Jordan Hayes", company: "Hayes Plumbing", service: "Website", value: "$6,500", priority: 72, daysInStage: 1 },
      { id: "p2", name: "Nina Patel", company: "Patel Dental", service: "Website + Booking", value: "$9,500", priority: 68, daysInStage: 2 },
    ],
  },
  {
    id: "discovery_call",
    label: "Discovery Call",
    cards: [
      { id: "p3", name: "Keisha Odom", company: "Nourish Kitchen Co.", service: "E-Commerce", value: "$12,000", priority: 78, daysInStage: 3 },
    ],
  },
  {
    id: "proposal_sent",
    label: "Proposal Sent",
    cards: [
      { id: "p4", name: "David Chen", company: "Apex Consulting", service: "CRM / Dashboard", value: "$24,000", priority: 74, daysInStage: 2 },
      { id: "p5", name: "Marcus Rivera", company: "Rivera Legal Group", service: "Web App", value: "$22,000", priority: 87, daysInStage: 1 },
    ],
  },
  {
    id: "proposal_accepted",
    label: "Accepted",
    cards: [
      { id: "p6", name: "Sarah Mitchell", company: "Bloom Wellness Studio", service: "Website + Booking", value: "$14,500", priority: 92, daysInStage: 0 },
    ],
  },
  {
    id: "in_development",
    label: "In Development",
    cards: [
      { id: "p7", name: "Amara Diallo", company: "Uplift Nonprofit", service: "Website", value: "$9,500", priority: 80, daysInStage: 12 },
      { id: "p8", name: "Jasmine Okafor", company: "Glow Beauty Bar", service: "Website", value: "$7,500", priority: 65, daysInStage: 8 },
    ],
  },
  {
    id: "review_qa",
    label: "Review / QA",
    cards: [],
  },
  {
    id: "launched",
    label: "Launched",
    cards: [
      { id: "p9", name: "Rachel Simmons", company: "Luxe Hair Lounge", service: "Website", value: "$8,500", priority: 88, daysInStage: 5 },
      { id: "p10", name: "Tom Nakamura", company: "Greenfield Realty", service: "Website", value: "$12,000", priority: 76, daysInStage: 14 },
    ],
  },
];

export type DemoIntake = {
  id: string;
  name: string;
  email: string;
  company: string;
  industry: string;
  services: string[];
  budget: string;
  timeline: string;
  description: string;
  complexity: number;
  complexityLabel: string;
  priority: { score: number; label: string };
  submittedAt: string;
  status: string;
};

export const demoIntakes: DemoIntake[] = [
  {
    id: "i1",
    name: "Sarah Mitchell",
    email: "sarah@bloomwellness.com",
    company: "Bloom Wellness Studio",
    industry: "Beauty & Wellness",
    services: ["Website", "Online Booking"],
    budget: "$5,000 - $10,000",
    timeline: "4-6 weeks",
    description: "Need a modern website with an integrated booking system for our wellness studio. Clients should be able to book appointments, view services, and purchase gift cards online.",
    complexity: 5,
    complexityLabel: "Moderate",
    priority: { score: 92, label: "High" },
    submittedAt: "2026-03-05T14:30:00Z",
    status: "reviewed",
  },
  {
    id: "i2",
    name: "Marcus Rivera",
    email: "marcus@riveralegal.com",
    company: "Rivera Legal Group",
    industry: "Professional Services",
    services: ["Web App", "Client Portal"],
    budget: "$10,000 - $25,000",
    timeline: "8-12 weeks",
    description: "We need a secure client portal where our clients can upload documents, track case progress, and communicate with their assigned attorney. Must be HIPAA-adjacent in terms of security.",
    complexity: 7,
    complexityLabel: "Complex",
    priority: { score: 87, label: "High" },
    submittedAt: "2026-03-04T09:15:00Z",
    status: "discovery",
  },
  {
    id: "i3",
    name: "Keisha Odom",
    email: "keisha@nourishkitchen.com",
    company: "Nourish Kitchen Co.",
    industry: "Food & Beverage",
    services: ["E-Commerce", "Website"],
    budget: "$5,000 - $10,000",
    timeline: "6-8 weeks",
    description: "Launching a meal prep delivery service. Need an e-commerce site where customers can select weekly meal plans, customize orders, and manage subscriptions.",
    complexity: 6,
    complexityLabel: "Moderate",
    priority: { score: 78, label: "Medium" },
    submittedAt: "2026-03-03T16:45:00Z",
    status: "new",
  },
  {
    id: "i4",
    name: "David Chen",
    email: "david@apexconsulting.com",
    company: "Apex Consulting",
    industry: "Technology",
    services: ["CRM / Dashboard", "API Integration"],
    budget: "$10,000 - $25,000",
    timeline: "10-14 weeks",
    description: "Need a custom CRM that integrates with our existing tools (Slack, Google Workspace, QuickBooks). Must have pipeline management, automated follow-ups, and reporting dashboards.",
    complexity: 8,
    complexityLabel: "Complex",
    priority: { score: 74, label: "Medium" },
    submittedAt: "2026-03-02T11:20:00Z",
    status: "proposal",
  },
  {
    id: "i5",
    name: "Jasmine Okafor",
    email: "jasmine@glowbeautybar.com",
    company: "Glow Beauty Bar",
    industry: "Beauty & Wellness",
    services: ["Website"],
    budget: "$2,000 - $5,000",
    timeline: "2-3 weeks",
    description: "Simple but beautiful website to showcase our services, team, and location. Need a gallery, service menu with prices, and contact form.",
    complexity: 3,
    complexityLabel: "Simple",
    priority: { score: 65, label: "Medium" },
    submittedAt: "2026-03-01T08:00:00Z",
    status: "in_progress",
  },
];

export type DemoProposal = {
  id: string;
  clientName: string;
  company: string;
  title: string;
  amount: string;
  status: "draft" | "sent" | "accepted" | "declined";
  sentAt: string | null;
  createdAt: string;
};

export const demoProposals: DemoProposal[] = [
  {
    id: "pr1",
    clientName: "Sarah Mitchell",
    company: "Bloom Wellness Studio",
    title: "Wellness Studio Website + Booking System",
    amount: "$14,500",
    status: "accepted",
    sentAt: "2026-03-04T10:00:00Z",
    createdAt: "2026-03-03T15:00:00Z",
  },
  {
    id: "pr2",
    clientName: "Marcus Rivera",
    company: "Rivera Legal Group",
    title: "Secure Client Portal for Legal Practice",
    amount: "$22,000",
    status: "sent",
    sentAt: "2026-03-04T14:00:00Z",
    createdAt: "2026-03-04T09:00:00Z",
  },
  {
    id: "pr3",
    clientName: "David Chen",
    company: "Apex Consulting",
    title: "Custom CRM with Integrations",
    amount: "$24,000",
    status: "sent",
    sentAt: "2026-03-02T16:00:00Z",
    createdAt: "2026-03-02T12:00:00Z",
  },
  {
    id: "pr4",
    clientName: "Jasmine Okafor",
    company: "Glow Beauty Bar",
    title: "Beauty Bar Website Design",
    amount: "$7,500",
    status: "accepted",
    sentAt: "2026-02-28T11:00:00Z",
    createdAt: "2026-02-27T14:00:00Z",
  },
  {
    id: "pr5",
    clientName: "Keisha Odom",
    company: "Nourish Kitchen Co.",
    title: "Meal Prep E-Commerce Platform",
    amount: "$12,000",
    status: "draft",
    sentAt: null,
    createdAt: "2026-03-05T08:00:00Z",
  },
];

export type DemoInvoice = {
  id: string;
  invoiceNumber: string;
  clientName: string;
  company: string;
  amount: string;
  status: "draft" | "sent" | "paid" | "overdue";
  dueDate: string;
  issuedAt: string;
};

export const demoInvoices: DemoInvoice[] = [
  {
    id: "inv1",
    invoiceNumber: "INV-2026-001",
    clientName: "Rachel Simmons",
    company: "Luxe Hair Lounge",
    amount: "$8,500",
    status: "paid",
    dueDate: "2026-03-15",
    issuedAt: "2026-03-01",
  },
  {
    id: "inv2",
    invoiceNumber: "INV-2026-002",
    clientName: "Tom Nakamura",
    company: "Greenfield Realty",
    amount: "$12,000",
    status: "paid",
    dueDate: "2026-03-10",
    issuedAt: "2026-02-20",
  },
  {
    id: "inv3",
    invoiceNumber: "INV-2026-003",
    clientName: "Sarah Mitchell",
    company: "Bloom Wellness Studio",
    amount: "$7,250",
    status: "sent",
    dueDate: "2026-03-20",
    issuedAt: "2026-03-05",
  },
  {
    id: "inv4",
    invoiceNumber: "INV-2026-004",
    clientName: "Amara Diallo",
    company: "Uplift Nonprofit",
    amount: "$4,750",
    status: "sent",
    dueDate: "2026-03-25",
    issuedAt: "2026-03-04",
  },
  {
    id: "inv5",
    invoiceNumber: "INV-2026-005",
    clientName: "Marcus Rivera",
    company: "Rivera Legal Group",
    amount: "$11,000",
    status: "draft",
    dueDate: "2026-04-01",
    issuedAt: "2026-03-06",
  },
  {
    id: "inv6",
    invoiceNumber: "INV-2026-006",
    clientName: "Jasmine Okafor",
    company: "Glow Beauty Bar",
    amount: "$3,750",
    status: "paid",
    dueDate: "2026-03-08",
    issuedAt: "2026-02-25",
  },
];

export type DemoProject = {
  id: string;
  name: string;
  clientName: string;
  company: string;
  status: "planning" | "in_progress" | "review" | "completed";
  progress: number;
  startDate: string;
  targetDate: string;
  budget: string;
};

export const demoProjects: DemoProject[] = [
  {
    id: "proj1",
    name: "Bloom Wellness Website",
    clientName: "Sarah Mitchell",
    company: "Bloom Wellness Studio",
    status: "planning",
    progress: 10,
    startDate: "2026-03-06",
    targetDate: "2026-04-17",
    budget: "$14,500",
  },
  {
    id: "proj2",
    name: "Glow Beauty Bar Website",
    clientName: "Jasmine Okafor",
    company: "Glow Beauty Bar",
    status: "in_progress",
    progress: 65,
    startDate: "2026-02-20",
    targetDate: "2026-03-14",
    budget: "$7,500",
  },
  {
    id: "proj3",
    name: "Uplift Nonprofit Website",
    clientName: "Amara Diallo",
    company: "Uplift Nonprofit",
    status: "in_progress",
    progress: 45,
    startDate: "2026-02-15",
    targetDate: "2026-03-28",
    budget: "$9,500",
  },
  {
    id: "proj4",
    name: "Luxe Hair Lounge Website",
    clientName: "Rachel Simmons",
    company: "Luxe Hair Lounge",
    status: "completed",
    progress: 100,
    startDate: "2026-01-15",
    targetDate: "2026-03-01",
    budget: "$8,500",
  },
  {
    id: "proj5",
    name: "Greenfield Realty Website",
    clientName: "Tom Nakamura",
    company: "Greenfield Realty",
    status: "completed",
    progress: 100,
    startDate: "2026-01-10",
    targetDate: "2026-02-20",
    budget: "$12,000",
  },
];

export const demoAnalytics = {
  revenue: {
    total: "$98,000",
    thisMonth: "$22,500",
    lastMonth: "$18,000",
    change: 25,
  },
  clients: {
    total: 8,
    active: 5,
    newThisMonth: 2,
  },
  proposals: {
    sent: 4,
    accepted: 2,
    conversionRate: 50,
  },
  projects: {
    active: 3,
    completed: 2,
    avgDeliveryDays: 38,
  },
  monthlyRevenue: [
    { month: "Oct", amount: 12000 },
    { month: "Nov", amount: 14500 },
    { month: "Dec", amount: 16000 },
    { month: "Jan", amount: 15000 },
    { month: "Feb", amount: 18000 },
    { month: "Mar", amount: 22500 },
  ],
};
