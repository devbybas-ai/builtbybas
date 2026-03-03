// ============================================================
// BBB Demo Platform — Seed Data
// Realistic data for all 16 business systems
// ============================================================

// ---- INTRANET ----
export const announcements = [
  { id: "1", title: "Q1 All-Hands Meeting — March 15th", body: "Join us for our quarterly all-hands. Agenda: product roadmap, team updates, and open Q&A. Lunch provided.", author: "Sarah Kim", role: "CEO", date: "2026-03-10", pinned: true, category: "Company", reactions: [{ emoji: "👍", count: 24 }, { emoji: "❤️", count: 8 }, { emoji: "👏", count: 12 }] },
  { id: "2", title: "New Benefits Portal Now Live", body: "Enroll in or update your health, dental, and vision benefits through the new HR portal. Open enrollment closes March 20th.", author: "Marcus Hill", role: "HR Director", date: "2026-03-08", pinned: true, category: "HR", reactions: [{ emoji: "👍", count: 15 }, { emoji: "❤️", count: 4 }, { emoji: "👏", count: 6 }] },
  { id: "3", title: "Office Closure — March 17th (St. Patrick's Day)", body: "The office will be closed. Remote staff should update their availability in the calendar.", author: "Office Manager", role: "Operations", date: "2026-03-07", pinned: false, category: "Operations", reactions: [{ emoji: "👍", count: 9 }, { emoji: "❤️", count: 1 }, { emoji: "👏", count: 2 }] },
  { id: "4", title: "New Hire: Jordan Walsh joins the Engineering Team", body: "Please join us in welcoming Jordan Walsh as our new Senior Frontend Engineer. Jordan comes from Stripe and specializes in React.", author: "Sarah Kim", role: "CEO", date: "2026-03-05", pinned: false, category: "People", reactions: [{ emoji: "👍", count: 18 }, { emoji: "❤️", count: 11 }, { emoji: "👏", count: 14 }] },
  { id: "5", title: "IT Security Reminder — Enable 2FA", body: "As part of our security audit, all accounts must have 2FA enabled by March 12th. Contact IT if you need help.", author: "Derek Lam", role: "IT Security", date: "2026-03-03", pinned: false, category: "IT", reactions: [{ emoji: "👍", count: 5 }, { emoji: "❤️", count: 0 }, { emoji: "👏", count: 1 }] },
  { id: "6", title: "Parking Lot Maintenance — Lots C & D", body: "Lots C and D will be closed March 14-16 for resurfacing. Please use the overflow lot on Main Street.", author: "Facilities", role: "Facilities", date: "2026-03-01", pinned: false, category: "Facilities", reactions: [{ emoji: "👍", count: 3 }, { emoji: "❤️", count: 0 }, { emoji: "👏", count: 0 }] },
];

export const employees = [
  { id: "1", name: "Sarah Kim", title: "Chief Executive Officer", dept: "Executive", email: "s.kim@meridian.com", phone: "555-0101", location: "HQ — Floor 4", status: "online", avatar: "SK" },
  { id: "2", name: "Marcus Hill", title: "HR Director", dept: "Human Resources", email: "m.hill@meridian.com", phone: "555-0102", location: "HQ — Floor 3", status: "online", avatar: "MH" },
  { id: "3", name: "Jordan Walsh", title: "Senior Frontend Engineer", dept: "Engineering", email: "j.walsh@meridian.com", phone: "555-0103", location: "Remote — Austin, TX", status: "online", avatar: "JW" },
  { id: "4", name: "Derek Lam", title: "IT Security Lead", dept: "IT", email: "d.lam@meridian.com", phone: "555-0104", location: "HQ — Floor 2", status: "busy", avatar: "DL" },
  { id: "5", name: "Priya Patel", title: "Product Manager", dept: "Product", email: "p.patel@meridian.com", phone: "555-0105", location: "HQ — Floor 3", status: "online", avatar: "PP" },
  { id: "6", name: "Carlos Mendez", title: "Sales Director", dept: "Sales", email: "c.mendez@meridian.com", phone: "555-0106", location: "HQ — Floor 2", status: "away", avatar: "CM" },
  { id: "7", name: "Aisha Johnson", title: "Marketing Manager", dept: "Marketing", email: "a.johnson@meridian.com", phone: "555-0107", location: "Remote — Chicago, IL", status: "online", avatar: "AJ" },
  { id: "8", name: "Tom Fischer", title: "Operations Manager", dept: "Operations", email: "t.fischer@meridian.com", phone: "555-0108", location: "HQ — Floor 1", status: "on-leave", avatar: "TF" },
  { id: "9", name: "Elena Vasquez", title: "UX Designer", dept: "Design", email: "e.vasquez@meridian.com", phone: "555-0109", location: "Remote — Miami, FL", status: "online", avatar: "EV" },
  { id: "10", name: "Ryan Cho", title: "Backend Engineer", dept: "Engineering", email: "r.cho@meridian.com", phone: "555-0110", location: "HQ — Floor 2", status: "online", avatar: "RC" },
  { id: "11", name: "Natalie Brooks", title: "Customer Success Manager", dept: "Sales", email: "n.brooks@meridian.com", phone: "555-0111", location: "Remote — Denver, CO", status: "away", avatar: "NB" },
  { id: "12", name: "James Osei", title: "Finance Analyst", dept: "Finance", email: "j.osei@meridian.com", phone: "555-0112", location: "HQ — Floor 4", status: "offline", avatar: "JO" },
];

export const companyDocs = [
  { id: "1", name: "Employee Handbook 2026", category: "HR", type: "PDF", size: "2.4 MB", updated: "2026-01-15", author: "Marcus Hill" },
  { id: "2", name: "Benefits Guide — Health & Dental", category: "HR", type: "PDF", size: "1.1 MB", updated: "2026-02-01", author: "Marcus Hill" },
  { id: "3", name: "IT Security Policy v3.2", category: "IT", type: "PDF", size: "890 KB", updated: "2026-03-01", author: "Derek Lam" },
  { id: "4", name: "Q1 2026 Company Goals", category: "Strategy", type: "DOC", size: "340 KB", updated: "2026-01-05", author: "Sarah Kim" },
  { id: "5", name: "Expense Report Template", category: "Finance", type: "XLSX", size: "128 KB", updated: "2025-12-01", author: "James Osei" },
  { id: "6", name: "Brand Guidelines v2", category: "Marketing", type: "PDF", size: "5.2 MB", updated: "2026-02-14", author: "Aisha Johnson" },
];

export const intranetNotifications = [
  { id: "n1", text: "Sarah Kim posted: Q1 All-Hands Meeting", time: "2h ago", type: "announcement" },
  { id: "n2", text: "Jordan Walsh joined the Engineering team", time: "5h ago", type: "people" },
  { id: "n3", text: "IT Security: Enable 2FA by March 12th", time: "1d ago", type: "alert" },
];

// ---- DOCUMENT FILING ----
export const folders = [
  { id: "1", name: "Human Resources", icon: "users", fileCount: 24, updated: "2026-03-09", color: "violet" },
  { id: "2", name: "Finance", icon: "dollar", fileCount: 67, updated: "2026-03-10", color: "emerald" },
  { id: "3", name: "Legal", icon: "scale", fileCount: 31, updated: "2026-03-05", color: "amber" },
  { id: "4", name: "Marketing", icon: "megaphone", fileCount: 89, updated: "2026-03-08", color: "rose" },
  { id: "5", name: "Engineering", icon: "cog", fileCount: 142, updated: "2026-03-10", color: "cyan" },
  { id: "6", name: "Operations", icon: "factory", fileCount: 38, updated: "2026-03-07", color: "amber" },
  { id: "7", name: "Sales", icon: "chart", fileCount: 56, updated: "2026-03-09", color: "emerald" },
  { id: "8", name: "Product", icon: "target", fileCount: 73, updated: "2026-03-10", color: "violet" },
];

export const files = [
  { id: "1", name: "Q1 Financial Report.xlsx", folder: "Finance", type: "XLSX", size: "1.2 MB", uploaded: "2026-03-10", uploadedBy: "James Osei", tags: ["quarterly", "finance", "2026"] },
  { id: "2", name: "NDA Template — Standard.docx", folder: "Legal", type: "DOC", size: "45 KB", uploaded: "2026-03-08", uploadedBy: "Sarah Kim", tags: ["legal", "template", "nda"] },
  { id: "3", name: "Brand Guidelines v2.pdf", folder: "Marketing", type: "PDF", size: "5.2 MB", uploaded: "2026-02-14", uploadedBy: "Aisha Johnson", tags: ["brand", "design", "guidelines"] },
  { id: "4", name: "API Documentation v4.pdf", folder: "Engineering", type: "PDF", size: "8.7 MB", uploaded: "2026-03-07", uploadedBy: "Ryan Cho", tags: ["api", "docs", "technical"] },
  { id: "5", name: "Employee Handbook 2026.pdf", folder: "Human Resources", type: "PDF", size: "2.4 MB", uploaded: "2026-01-15", uploadedBy: "Marcus Hill", tags: ["hr", "policy", "2026"] },
  { id: "6", name: "Product Roadmap Q2.pptx", folder: "Product", type: "PPT", size: "3.1 MB", uploaded: "2026-03-09", uploadedBy: "Priya Patel", tags: ["roadmap", "product", "q2"] },
  { id: "7", name: "Sales Playbook 2026.pdf", folder: "Sales", type: "PDF", size: "2.8 MB", uploaded: "2026-02-20", uploadedBy: "Carlos Mendez", tags: ["sales", "playbook", "process"] },
  { id: "8", name: "Server Infrastructure Map.png", folder: "Engineering", type: "IMG", size: "678 KB", uploaded: "2026-03-05", uploadedBy: "Derek Lam", tags: ["infrastructure", "servers", "diagram"] },
];

// ---- MEETING ROOMS ----
export const rooms = [
  { id: "1", name: "The Boardroom", capacity: 20, floor: "4th Floor", amenities: ["4K Display", "Video Conf", "Whiteboard", "Phone"], color: "cyan" },
  { id: "2", name: "Innovation Lab", capacity: 12, floor: "3rd Floor", amenities: ["Dual Screens", "Video Conf", "Whiteboard"], color: "violet" },
  { id: "3", name: "Focus Room A", capacity: 4, floor: "2nd Floor", amenities: ["Monitor", "Video Conf"], color: "emerald" },
  { id: "4", name: "Focus Room B", capacity: 4, floor: "2nd Floor", amenities: ["Monitor", "Video Conf"], color: "emerald" },
  { id: "5", name: "The Greenhouse", capacity: 8, floor: "3rd Floor", amenities: ["TV", "Whiteboard", "Natural Light"], color: "amber" },
  { id: "6", name: "Executive Suite", capacity: 6, floor: "4th Floor", amenities: ["4K Display", "Video Conf", "Phone", "Premium AV"], color: "rose" },
];

export const bookings = [
  { id: "1", roomId: "1", roomName: "The Boardroom", title: "Q1 All-Hands", organizer: "Sarah Kim", date: "2026-03-15", start: "10:00", end: "12:00", attendees: 18 },
  { id: "2", roomId: "2", roomName: "Innovation Lab", title: "Product Sprint Planning", organizer: "Priya Patel", date: "2026-03-11", start: "09:00", end: "11:00", attendees: 8 },
  { id: "3", roomId: "3", roomName: "Focus Room A", title: "1:1 — Engineering", organizer: "Jordan Walsh", date: "2026-03-11", start: "14:00", end: "15:00", attendees: 2 },
  { id: "4", roomId: "5", roomName: "The Greenhouse", title: "Design Review", organizer: "Elena Vasquez", date: "2026-03-12", start: "11:00", end: "12:30", attendees: 5 },
  { id: "5", roomId: "6", roomName: "Executive Suite", title: "Investor Call", organizer: "Sarah Kim", date: "2026-03-13", start: "15:00", end: "16:00", attendees: 4 },
];

// ---- HELP DESK ----
export const helpTickets = [
  { id: "HD-001", title: "Laptop won't connect to VPN", requester: "Jordan Walsh", dept: "Engineering", priority: "high", status: "open", category: "IT", created: "2026-03-10T09:15:00", assignee: "Derek Lam", updates: 2 },
  { id: "HD-002", title: "Printer on 3rd floor is offline", requester: "Marcus Hill", dept: "HR", priority: "medium", status: "in-progress", category: "Facilities", created: "2026-03-09T14:30:00", assignee: "Tom Fischer", updates: 1 },
  { id: "HD-003", title: "Need access to Salesforce for new hire", requester: "Carlos Mendez", dept: "Sales", priority: "high", status: "open", category: "IT", created: "2026-03-10T11:00:00", assignee: null, updates: 0 },
  { id: "HD-004", title: "Expense report system throwing errors", requester: "James Osei", dept: "Finance", priority: "medium", status: "resolved", category: "Software", created: "2026-03-08T10:00:00", assignee: "Derek Lam", updates: 4 },
  { id: "HD-005", title: "Conference room TV remote missing", requester: "Priya Patel", dept: "Product", priority: "low", status: "open", category: "Facilities", created: "2026-03-10T08:45:00", assignee: null, updates: 0 },
  { id: "HD-006", title: "Password reset request", requester: "Aisha Johnson", dept: "Marketing", priority: "medium", status: "resolved", category: "IT", created: "2026-03-07T16:00:00", assignee: "Derek Lam", updates: 2 },
  { id: "HD-007", title: "Slack notifications not working on mobile", requester: "Natalie Brooks", dept: "Sales", priority: "low", status: "in-progress", category: "Software", created: "2026-03-09T09:30:00", assignee: "Derek Lam", updates: 1 },
];

// ---- INVENTORY ----
export const inventoryItems = [
  { id: "INV-001", name: "Wireless Keyboard (Logitech MX Keys)", sku: "LGT-MX-001", category: "Electronics", qty: 34, minQty: 10, unitCost: 109.99, location: "Storage A-1", status: "in-stock" },
  { id: "INV-002", name: "USB-C Hub (7-Port)", sku: "USB-HUB-7P", category: "Electronics", qty: 6, minQty: 8, unitCost: 49.99, location: "Storage A-2", status: "low-stock" },
  { id: "INV-003", name: 'Monitor 27" 4K (LG)', sku: "LG-27-4K", category: "Electronics", qty: 12, minQty: 5, unitCost: 699.99, location: "Storage B-1", status: "in-stock" },
  { id: "INV-004", name: "Standing Desk (Electric)", sku: "DSK-ELEC-STD", category: "Furniture", qty: 3, minQty: 2, unitCost: 899.99, location: "Warehouse", status: "in-stock" },
  { id: "INV-005", name: "Ergonomic Chair (Herman Miller)", sku: "HM-AERON-B", category: "Furniture", qty: 0, minQty: 3, unitCost: 1495.00, location: "—", status: "out-of-stock" },
  { id: "INV-006", name: "Webcam HD 1080p (Logitech C920)", sku: "LGT-C920-HD", category: "Electronics", qty: 22, minQty: 10, unitCost: 69.99, location: "Storage A-3", status: "in-stock" },
  { id: "INV-007", name: "Ethernet Cable Cat6 (10ft)", sku: "CBL-CAT6-10", category: "Cables", qty: 150, minQty: 50, unitCost: 8.99, location: "Storage C-1", status: "in-stock" },
  { id: "INV-008", name: "Laptop Stand (Adjustable)", sku: "STD-LAP-ADJ", category: "Accessories", qty: 7, minQty: 10, unitCost: 39.99, location: "Storage A-4", status: "low-stock" },
  { id: "INV-009", name: "Whiteboard Markers (Pack of 12)", sku: "MRK-WB-12PK", category: "Office Supplies", qty: 45, minQty: 20, unitCost: 12.99, location: "Supply Room", status: "in-stock" },
  { id: "INV-010", name: "HDMI Cable 6ft (4K)", sku: "CBL-HDMI-6", category: "Cables", qty: 4, minQty: 15, unitCost: 14.99, location: "Storage C-2", status: "low-stock" },
];

// ---- ASSETS ----
export const assets = [
  { id: "AST-001", name: 'MacBook Pro 16" M3', serial: "C02XK1JQMD6M", category: "Laptop", assignedTo: "Jordan Walsh", dept: "Engineering", purchaseDate: "2024-01-15", value: 3499.00, status: "active", location: "Remote — Austin, TX" },
  { id: "AST-002", name: 'MacBook Pro 14" M3', serial: "C02Y8KQMD6T", category: "Laptop", assignedTo: "Elena Vasquez", dept: "Design", purchaseDate: "2024-03-10", value: 2499.00, status: "active", location: "Remote — Miami, FL" },
  { id: "AST-003", name: "iPhone 15 Pro", serial: "DNMR7KPLS2", category: "Mobile", assignedTo: "Sarah Kim", dept: "Executive", purchaseDate: "2023-10-01", value: 1199.00, status: "active", location: "HQ — Floor 4" },
  { id: "AST-004", name: 'Dell XPS 15"', serial: "7DX4KLP20", category: "Laptop", assignedTo: null, dept: null, purchaseDate: "2022-08-20", value: 1899.00, status: "available", location: "IT Storage" },
  { id: "AST-005", name: "Canon EOS R6 (Camera)", serial: "CAM-2024-042", category: "Equipment", assignedTo: "Aisha Johnson", dept: "Marketing", purchaseDate: "2024-06-01", value: 2499.00, status: "active", location: "Marketing Studio" },
  { id: "AST-006", name: 'iPad Pro 12.9" (2024)', serial: "DMPJX9KQ7", category: "Tablet", assignedTo: "Priya Patel", dept: "Product", purchaseDate: "2024-02-14", value: 1299.00, status: "active", location: "HQ — Floor 3" },
  { id: "AST-007", name: "HP LaserJet Pro (Printer)", serial: "HPL-VN12378", category: "Printer", assignedTo: null, dept: "All", purchaseDate: "2023-04-01", value: 449.00, status: "maintenance", location: "HQ — Floor 3" },
  { id: "AST-008", name: "Cisco IP Phone 8841", serial: "CSC-P0234X", category: "Phone", assignedTo: "Carlos Mendez", dept: "Sales", purchaseDate: "2022-11-15", value: 299.00, status: "active", location: "HQ — Floor 2" },
];

// ---- MAINTENANCE ----
export const maintenanceRequests = [
  { id: "MR-001", title: "HVAC Unit — Floor 3 Not Cooling", location: "3rd Floor", priority: "high", status: "in-progress", reported: "2026-03-09", assignee: "HVAC Pro Services", scheduledFor: "2026-03-11", category: "HVAC" },
  { id: "MR-002", title: "Broken Blinds — Conference Room B", location: "2nd Floor", priority: "low", status: "pending", reported: "2026-03-10", assignee: null, scheduledFor: null, category: "Facilities" },
  { id: "MR-003", title: "Water Leak — Server Room", location: "Basement", priority: "critical", status: "completed", reported: "2026-03-07", assignee: "QuickFix Plumbing", scheduledFor: "2026-03-07", category: "Plumbing" },
  { id: "MR-004", title: "Elevator — Slow Response", location: "Main Elevator", priority: "medium", status: "scheduled", reported: "2026-03-08", assignee: "Otis Elevator Co.", scheduledFor: "2026-03-14", category: "Elevator" },
  { id: "MR-005", title: "Parking Lot Lights Out — Section C", location: "Parking Lot C", priority: "medium", status: "pending", reported: "2026-03-10", assignee: null, scheduledFor: null, category: "Electrical" },
  { id: "MR-006", title: "Office Kitchen Faucet Dripping", location: "3rd Floor Kitchen", priority: "low", status: "scheduled", reported: "2026-03-06", assignee: "QuickFix Plumbing", scheduledFor: "2026-03-13", category: "Plumbing" },
];

// ---- PURCHASE ORDERS ----
export const purchaseOrders = [
  { id: "PO-2026-001", vendor: "Logitech", items: [{ desc: "Wireless Keyboard MX Keys", qty: 20, unit: 89.99 }, { desc: "Wireless Mouse MX Master", qty: 20, unit: 79.99 }], total: 3398.00, requestedBy: "Derek Lam", dept: "IT", status: "approved", date: "2026-03-08", approvedBy: "Sarah Kim" },
  { id: "PO-2026-002", vendor: "Herman Miller", items: [{ desc: "Aeron Chair — Size B", qty: 5, unit: 1495.00 }], total: 7475.00, requestedBy: "Tom Fischer", dept: "Operations", status: "pending", date: "2026-03-10", approvedBy: null },
  { id: "PO-2026-003", vendor: "AWS", items: [{ desc: "Reserved Instance — r6g.2xlarge (1yr)", qty: 3, unit: 1842.00 }], total: 5526.00, requestedBy: "Ryan Cho", dept: "Engineering", status: "approved", date: "2026-03-05", approvedBy: "Sarah Kim" },
  { id: "PO-2026-004", vendor: "Adobe", items: [{ desc: "Creative Cloud Business (10 seats)", qty: 10, unit: 84.99 }], total: 849.90, requestedBy: "Aisha Johnson", dept: "Marketing", status: "received", date: "2026-03-01", approvedBy: "Marcus Hill" },
  { id: "PO-2026-005", vendor: "Office Depot", items: [{ desc: "Copy Paper (Case)", qty: 10, unit: 49.99 }, { desc: "Printer Ink Cartridges", qty: 6, unit: 34.99 }], total: 709.84, requestedBy: "Office Manager", dept: "Operations", status: "received", date: "2026-02-28", approvedBy: "Tom Fischer" },
  { id: "PO-2026-006", vendor: "Zoom Video", items: [{ desc: "Zoom Business Plan (annual, 50 users)", qty: 1, unit: 15000.00 }], total: 15000.00, requestedBy: "Sarah Kim", dept: "Executive", status: "rejected", date: "2026-03-09", approvedBy: "James Osei" },
];

// ---- INSPECTIONS ----
export const inspectionTemplates = [
  { id: "1", name: "Monthly Fire Safety Check", category: "Safety", items: 12, frequency: "Monthly", lastRun: "2026-03-01" },
  { id: "2", name: "Kitchen Sanitation Audit", category: "Health", items: 18, frequency: "Weekly", lastRun: "2026-03-07" },
  { id: "3", name: "IT Security Compliance", category: "Security", items: 25, frequency: "Quarterly", lastRun: "2026-01-15" },
  { id: "4", name: "Vehicle Fleet Inspection", category: "Fleet", items: 15, frequency: "Monthly", lastRun: "2026-03-02" },
];

export const inspectionReports = [
  { id: "IR-001", template: "Monthly Fire Safety Check", inspector: "Tom Fischer", date: "2026-03-01", score: 92, status: "passed", items: 12, passed: 11, failed: 1 },
  { id: "IR-002", template: "Kitchen Sanitation Audit", inspector: "Marcus Hill", date: "2026-03-07", score: 100, status: "passed", items: 18, passed: 18, failed: 0 },
  { id: "IR-003", template: "IT Security Compliance", inspector: "Derek Lam", date: "2026-01-15", score: 76, status: "needs-attention", items: 25, passed: 19, failed: 6 },
  { id: "IR-004", template: "Vehicle Fleet Inspection", inspector: "Tom Fischer", date: "2026-03-02", score: 87, status: "passed", items: 15, passed: 13, failed: 2 },
];

// ---- CLIENT PORTAL ----
export const portalClients = [
  {
    id: "CL-001", name: "Meridian Plumbing Co.", contact: "Dave Merritt", email: "dave@meridianplumbing.com", project: "Custom Business Website",
    status: "in-progress", phase: "Development", progress: 65, budget: 8500, billed: 4250,
    nextMilestone: "Homepage Approval", milestoneDate: "2026-03-20",
    messages: [
      { from: "BuiltByBas", text: "Homepage mockup is ready for your review.", date: "2026-03-09" },
      { from: "Dave Merritt", text: "Looks great! Can we adjust the color scheme?", date: "2026-03-10" },
    ],
  },
  {
    id: "CL-002", name: "Atlas Consulting Group", contact: "Jessica Price", email: "j.price@atlascg.com", project: "CRM System + Client Portal",
    status: "review", phase: "Client Review", progress: 90, budget: 22000, billed: 18700,
    nextMilestone: "Final Sign-off", milestoneDate: "2026-03-15",
    messages: [
      { from: "BuiltByBas", text: "Phase 2 is complete — please review and provide feedback.", date: "2026-03-08" },
      { from: "Jessica Price", text: "Excellent work, we'll review by Friday.", date: "2026-03-09" },
    ],
  },
  {
    id: "CL-003", name: "Bloom Botanicals", contact: "Rachel Kim", email: "r.kim@bloombotanicals.com", project: "E-Commerce Platform",
    status: "planning", phase: "Discovery", progress: 15, budget: 18000, billed: 2700,
    nextMilestone: "Wireframe Presentation", milestoneDate: "2026-03-25",
    messages: [
      { from: "BuiltByBas", text: "Kickoff call confirmed for Monday at 10 AM.", date: "2026-03-07" },
    ],
  },
];

// ---- BOOKING ----
export const services = [
  { id: "1", name: "Strategy Consultation", duration: 60, price: 250, color: "cyan" },
  { id: "2", name: "Website Audit", duration: 90, price: 350, color: "violet" },
  { id: "3", name: "Project Kickoff", duration: 120, price: 500, color: "emerald" },
  { id: "4", name: "Design Review", duration: 45, price: 175, color: "amber" },
];

export const appointments = [
  { id: "APT-001", service: "Strategy Consultation", client: "Marcus Webb", email: "m.webb@email.com", date: "2026-03-11", time: "10:00", status: "confirmed", notes: "New client — e-commerce startup" },
  { id: "APT-002", service: "Website Audit", client: "Lisa Thornton", email: "l.thornton@email.com", date: "2026-03-11", time: "13:00", status: "confirmed", notes: "Existing site on WordPress" },
  { id: "APT-003", service: "Project Kickoff", client: "Meridian Plumbing", email: "dave@meridianplumbing.com", date: "2026-03-12", time: "09:00", status: "confirmed", notes: "" },
  { id: "APT-004", service: "Design Review", client: "Atlas Consulting", email: "j.price@atlascg.com", date: "2026-03-13", time: "14:00", status: "pending", notes: "" },
  { id: "APT-005", service: "Strategy Consultation", client: "New Client", email: "newclient@email.com", date: "2026-03-14", time: "11:00", status: "cancelled", notes: "Rescheduling" },
];

// ---- PROPOSALS ----
export const demoProposals = [
  {
    id: "PROP-001", client: "Nexus Law Group", contact: "Patricia Holden", email: "p.holden@nexuslaw.com",
    title: "Full Website Redesign + Client Portal", value: 34500, status: "sent", created: "2026-03-05", expires: "2026-04-05",
    services: [
      { name: "Custom Law Firm Website", desc: "7-page responsive site with practice area pages, attorney profiles, and contact forms", price: 12500 },
      { name: "Secure Client Portal", desc: "Document sharing, case status tracking, secure messaging", price: 15000 },
      { name: "AI Chat Assistant", desc: "Trained on firm FAQs and practice areas for 24/7 intake", price: 7000 },
    ],
  },
  {
    id: "PROP-002", client: "Summit Fitness", contact: "Chris Bower", email: "c.bower@summitfitness.com",
    title: "Membership Management Platform", value: 18900, status: "accepted", created: "2026-02-20", expires: "2026-03-20",
    services: [
      { name: "Member Dashboard", desc: "Class booking, progress tracking, membership management", price: 10500 },
      { name: "Staff Admin Panel", desc: "Attendance, billing, communications", price: 8400 },
    ],
  },
  {
    id: "PROP-003", client: "Bloom Botanicals", contact: "Rachel Kim", email: "r.kim@bloombotanicals.com",
    title: "E-Commerce + Inventory System", value: 22000, status: "draft", created: "2026-03-09", expires: "2026-04-09",
    services: [
      { name: "Custom E-Commerce Storefront", desc: "Product catalog, cart, checkout, order management", price: 15000 },
      { name: "Inventory Management System", desc: "Stock tracking, supplier management, low-stock alerts", price: 7000 },
    ],
  },
];

// ---- SUPPORT TICKETS ----
export const supportTickets = [
  { id: "TKT-001", subject: "Can't access my account — password reset failed", client: "Dave Merritt", email: "dave@meridianplumbing.com", priority: "high", status: "open", category: "Account", created: "2026-03-10T08:30:00", assignee: "Support Team", sla: "4hr", messages: 1 },
  { id: "TKT-002", subject: "Invoice shows wrong amount", client: "Jessica Price", email: "j.price@atlascg.com", priority: "medium", status: "in-progress", category: "Billing", created: "2026-03-09T14:00:00", assignee: "Billing Team", sla: "8hr", messages: 3 },
  { id: "TKT-003", subject: "Portal not loading on mobile Safari", client: "Rachel Kim", email: "r.kim@bloombotanicals.com", priority: "medium", status: "open", category: "Technical", created: "2026-03-10T11:15:00", assignee: null, sla: "8hr", messages: 0 },
  { id: "TKT-004", subject: "Request for new user account", client: "Chris Bower", email: "c.bower@summitfitness.com", priority: "low", status: "resolved", category: "Account", created: "2026-03-07T09:00:00", assignee: "Support Team", sla: "24hr", messages: 4 },
  { id: "TKT-005", subject: "Report export not generating PDF", client: "Patricia Holden", email: "p.holden@nexuslaw.com", priority: "high", status: "in-progress", category: "Technical", created: "2026-03-09T16:45:00", assignee: "Dev Team", sla: "4hr", messages: 2 },
];

// ---- VENDORS ----
export const vendors = [
  { id: "VND-001", name: "TechSupply Pro", category: "Electronics", contact: "Alan Torres", email: "alan@techsupplypro.com", phone: "555-0201", city: "San Jose, CA", rating: 4.8, status: "preferred", totalSpend: 48200, lastOrder: "2026-03-05" },
  { id: "VND-002", name: "QuickFix Plumbing", category: "Facilities", contact: "Bob O'Brien", email: "bob@quickfixplumbing.com", phone: "555-0202", city: "Los Angeles, CA", rating: 4.5, status: "preferred", totalSpend: 12400, lastOrder: "2026-03-07" },
  { id: "VND-003", name: "Herman Miller Direct", category: "Furniture", contact: "Diana Cho", email: "d.cho@hermanmiller.com", phone: "555-0203", city: "Zeeland, MI", rating: 4.9, status: "preferred", totalSpend: 89700, lastOrder: "2026-03-01" },
  { id: "VND-004", name: "Acme Office Supplies", category: "Office Supplies", contact: "Frank Wilson", email: "f.wilson@acmeoffice.com", phone: "555-0204", city: "Chicago, IL", rating: 3.9, status: "active", totalSpend: 8900, lastOrder: "2026-02-28" },
  { id: "VND-005", name: "CloudServe Solutions", category: "Cloud Services", contact: "Maya Gupta", email: "m.gupta@cloudserve.com", phone: "555-0205", city: "Austin, TX", rating: 4.6, status: "active", totalSpend: 36000, lastOrder: "2026-03-01" },
  { id: "VND-006", name: "Watts Electrical Services", category: "Electrical", contact: "Gary Watts", email: "gary@wattselectrical.com", phone: "555-0206", city: "Denver, CO", rating: 4.2, status: "active", totalSpend: 5400, lastOrder: "2026-02-15" },
  { id: "VND-007", name: "Design Print Co.", category: "Print & Marketing", contact: "Sadie Park", email: "sadie@designprintco.com", phone: "555-0207", city: "New York, NY", rating: 4.0, status: "inactive", totalSpend: 3200, lastOrder: "2025-11-20" },
];

// ---- ORDER TRACKING ----
export const orders = [
  { id: "ORD-2026-041", product: "Logitech MX Keys (x20)", vendor: "TechSupply Pro", ordered: "2026-03-08", estimated: "2026-03-12", status: "out-for-delivery", tracking: "1Z999AA10123456784", value: 1799.80, stages: ["ordered", "confirmed", "processing", "shipped", "out-for-delivery", "delivered"] },
  { id: "ORD-2026-038", product: "Herman Miller Aeron Chair (x5)", vendor: "Herman Miller Direct", ordered: "2026-03-05", estimated: "2026-03-18", status: "shipped", tracking: "1Z999AA10987654321", value: 7475.00, stages: ["ordered", "confirmed", "processing", "shipped", "out-for-delivery", "delivered"] },
  { id: "ORD-2026-035", product: "Adobe Creative Cloud (10 seats)", vendor: "Adobe", ordered: "2026-03-01", estimated: "2026-03-01", status: "delivered", tracking: "DIGITAL-DELIVERY", value: 849.90, stages: ["ordered", "confirmed", "processing", "shipped", "out-for-delivery", "delivered"] },
  { id: "ORD-2026-029", product: "Office Supplies Bundle", vendor: "Acme Office Supplies", ordered: "2026-02-28", estimated: "2026-03-05", status: "delivered", tracking: "1Z999AA10555666777", value: 709.84, stages: ["ordered", "confirmed", "processing", "shipped", "out-for-delivery", "delivered"] },
  { id: "ORD-2026-022", product: 'MacBook Pro 16" M3', vendor: "Apple Business", ordered: "2026-02-20", estimated: "2026-02-28", status: "delivered", tracking: "1Z999AA10111222333", value: 3499.00, stages: ["ordered", "confirmed", "processing", "shipped", "out-for-delivery", "delivered"] },
];

// ---- LOYALTY PROGRAM ----
export const loyaltyMembers = [
  { id: "LYL-001", name: "Dave Merritt", email: "dave@meridianplumbing.com", tier: "Gold", points: 8420, lifetimePoints: 24800, joinDate: "2024-03-15", lastActivity: "2026-03-05", nextTier: "Platinum", nextTierPoints: 10000 },
  { id: "LYL-002", name: "Jessica Price", email: "j.price@atlascg.com", tier: "Platinum", points: 24100, lifetimePoints: 61200, joinDate: "2023-08-01", lastActivity: "2026-03-09", nextTier: null, nextTierPoints: null },
  { id: "LYL-003", name: "Rachel Kim", email: "r.kim@bloombotanicals.com", tier: "Silver", points: 3750, lifetimePoints: 9200, joinDate: "2025-01-20", lastActivity: "2026-02-28", nextTier: "Gold", nextTierPoints: 5000 },
  { id: "LYL-004", name: "Chris Bower", email: "c.bower@summitfitness.com", tier: "Silver", points: 4200, lifetimePoints: 11500, joinDate: "2024-09-10", lastActivity: "2026-03-07", nextTier: "Gold", nextTierPoints: 5000 },
  { id: "LYL-005", name: "Patricia Holden", email: "p.holden@nexuslaw.com", tier: "Bronze", points: 1850, lifetimePoints: 3200, joinDate: "2025-10-05", lastActivity: "2026-03-01", nextTier: "Silver", nextTierPoints: 2500 },
];

export const rewards = [
  { id: "RWD-001", name: "Free Strategy Session (1hr)", points: 2000, category: "Services", available: true },
  { id: "RWD-002", name: "Website Performance Audit", points: 3500, category: "Services", available: true },
  { id: "RWD-003", name: "10% Off Next Invoice", points: 5000, category: "Discount", available: true },
  { id: "RWD-004", name: "Priority Support (1 Month)", points: 1500, category: "Support", available: true },
  { id: "RWD-005", name: "Free Content Update Package", points: 2500, category: "Services", available: true },
  { id: "RWD-006", name: "$500 Project Credit", points: 8000, category: "Discount", available: false },
];

export const loyaltyTransactions = [
  { id: "TXN-001", memberId: "LYL-001", type: "earn", description: "Invoice #INV-2026-012 paid", points: 850, date: "2026-03-05" },
  { id: "TXN-002", memberId: "LYL-002", type: "earn", description: "Referral bonus — Atlas Consulting", points: 2000, date: "2026-03-09" },
  { id: "TXN-003", memberId: "LYL-003", type: "redeem", description: "Free Strategy Session redeemed", points: -2000, date: "2026-02-28" },
  { id: "TXN-004", memberId: "LYL-004", type: "earn", description: "Project milestone reached", points: 500, date: "2026-03-07" },
  { id: "TXN-005", memberId: "LYL-005", type: "earn", description: "New member signup bonus", points: 500, date: "2025-10-05" },
];

export const tierConfig = [
  { name: "Bronze", min: 0, max: 2499, color: "amber", perks: ["Priority email support", "Monthly newsletter"] },
  { name: "Silver", min: 2500, max: 4999, color: "slate", perks: ["All Bronze perks", "5% referral bonus", "Quarterly check-in call"] },
  { name: "Gold", min: 5000, max: 9999, color: "yellow", perks: ["All Silver perks", "Free annual audit", "10% referral bonus", "Dedicated contact"] },
  { name: "Platinum", min: 10000, max: Infinity, color: "cyan", perks: ["All Gold perks", "15% referral bonus", "Priority feature requests", "Co-marketing opportunities"] },
];
