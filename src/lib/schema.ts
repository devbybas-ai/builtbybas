import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  index,
  integer,
  jsonb,
  numeric,
  text,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRoleEnum = pgEnum("user_role", ["owner", "team", "client"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull().default("client"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("idx_sessions_user_id").on(table.userId)]
);

// ============================================
// CRM — Pipeline, Clients, Notes
// ============================================

export const pipelineStageEnum = pgEnum("pipeline_stage", [
  "lead",
  "intake_submitted",
  "analysis_complete",
  "fit_assessment",
  "proposal_draft",
  "proposal_sent",
  "proposal_accepted",
  "contract_signed",
  "project_planning",
  "in_progress",
  "delivered",
  "completed",
]);

export const clientStatusEnum = pgEnum("client_status", [
  "active",
  "archived",
  "lost",
]);

export const clientNoteTypeEnum = pgEnum("client_note_type", [
  "general",
  "call",
  "email",
  "meeting",
  "internal",
]);

export const milestoneTypeEnum = pgEnum("milestone_type", [
  "deposit",
  "midpoint",
  "final",
]);
export const milestoneStatusEnum = pgEnum("milestone_status", [
  "pending",
  "draft_created",
  "sent",
  "paid",
  "cancelled",
]);

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 500 }).notNull(),
    email: varchar("email", { length: 500 }).notNull(),
    phone: varchar("phone", { length: 500 }),
    company: varchar("company", { length: 255 }).notNull(),
    industry: varchar("industry", { length: 100 }),
    website: varchar("website", { length: 500 }),
    pipelineStage: pipelineStageEnum("pipeline_stage")
      .notNull()
      .default("lead"),
    stageChangedAt: timestamp("stage_changed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    intakeSubmissionId: varchar("intake_submission_id", { length: 100 }),
    source: varchar("source", { length: 100 }),
    status: clientStatusEnum("status").notNull().default("active"),
    assignedTo: uuid("assigned_to").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_clients_pipeline_stage").on(table.pipelineStage),
    index("idx_clients_status").on(table.status),
    index("idx_clients_assigned_to").on(table.assignedTo),
    index("idx_clients_email").on(table.email),
  ]
);

export const pipelineHistory = pgTable(
  "pipeline_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    fromStage: pipelineStageEnum("from_stage"),
    toStage: pipelineStageEnum("to_stage").notNull(),
    changedBy: uuid("changed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    note: varchar("note", { length: 500 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_pipeline_history_client_id").on(table.clientId),
    index("idx_pipeline_history_changed_by").on(table.changedBy),
  ]
);

export const clientNotes = pgTable(
  "client_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: clientNoteTypeEnum("type").notNull().default("general"),
    content: varchar("content", { length: 5000 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_client_notes_client_id").on(table.clientId),
    index("idx_client_notes_author_id").on(table.authorId),
  ]
);

// ============================================
// Intake Submissions
// ============================================

export const intakeStatusEnum = pgEnum("intake_status", [
  "new",
  "reviewed",
  "accepted",
  "rejected",
  "converted",
]);

export const intakeSubmissions = pgTable(
  "intake_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    name: varchar("name", { length: 500 }).notNull(),
    email: varchar("email", { length: 500 }).notNull(),
    company: varchar("company", { length: 255 }).notNull(),
    complexityScore: integer("complexity_score"),
    primaryService: varchar("primary_service", { length: 255 }),
    status: intakeStatusEnum("status").notNull().default("new"),
    formData: jsonb("form_data").notNull(),
    analysis: jsonb("analysis").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_intake_submissions_email").on(table.email),
    index("idx_intake_submissions_submitted_at").on(table.submittedAt),
    index("idx_intake_submissions_status").on(table.status),
  ]
);

// ============================================
// Projects
// ============================================

export const projectStatusEnum = pgEnum("project_status", [
  "planning",
  "in_progress",
  "on_hold",
  "completed",
  "cancelled",
]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    status: projectStatusEnum("status").notNull().default("planning"),
    startDate: timestamp("start_date", { withTimezone: true }),
    targetDate: timestamp("target_date", { withTimezone: true }),
    completedDate: timestamp("completed_date", { withTimezone: true }),
    budgetCents: integer("budget_cents"),
    services: jsonb("services").$type<string[]>().default([]),
    assignedTo: uuid("assigned_to").references(() => users.id, {
      onDelete: "set null",
    }),
    billingModel: varchar("billing_model", { length: 50 }).default(
      "milestone_50_25_25"
    ),
    proposalId: uuid("proposal_id")
      .unique()
      .references(() => proposals.id, {
        onDelete: "set null",
      }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_projects_client_id").on(table.clientId),
    index("idx_projects_status").on(table.status),
    index("idx_projects_assigned_to").on(table.assignedTo),
  ]
);

// ============================================
// Invoices
// ============================================

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
]);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceNumber: varchar("invoice_number", { length: 20 }).notNull().unique(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    projectId: uuid("project_id").references(() => projects.id, {
      onDelete: "set null",
    }),
    status: invoiceStatusEnum("status").notNull().default("draft"),
    issuedDate: timestamp("issued_date", { withTimezone: true })
      .notNull()
      .defaultNow(),
    dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
    paidDate: timestamp("paid_date", { withTimezone: true }),
    subtotalCents: integer("subtotal_cents").notNull().default(0),
    taxRate: numeric("tax_rate", { precision: 5, scale: 4 }).default("0"),
    taxCents: integer("tax_cents").notNull().default(0),
    totalCents: integer("total_cents").notNull().default(0),
    notes: text("notes"),
    token: varchar("token", { length: 64 }).unique(),
    reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
    milestoneId: uuid("milestone_id"),
    paymentMethod: varchar("payment_method", { length: 50 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_invoices_client_id").on(table.clientId),
    index("idx_invoices_project_id").on(table.projectId),
    index("idx_invoices_status").on(table.status),
    index("idx_invoices_due_date").on(table.dueDate),
  ]
);

export const invoiceItems = pgTable(
  "invoice_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    description: varchar("description", { length: 500 }).notNull(),
    quantity: numeric("quantity", { precision: 10, scale: 2 })
      .notNull()
      .default("1"),
    unitPriceCents: integer("unit_price_cents").notNull(),
    totalCents: integer("total_cents").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => [index("idx_invoice_items_invoice_id").on(table.invoiceId)]
);

export const billingMilestones = pgTable(
  "billing_milestones",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    type: milestoneTypeEnum("type").notNull(),
    percentage: integer("percentage").notNull(),
    amountCents: integer("amount_cents").notNull(),
    scheduledDate: timestamp("scheduled_date", { withTimezone: true }),
    status: milestoneStatusEnum("status").notNull().default("pending"),
    invoiceId: uuid("invoice_id").references(() => invoices.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_billing_milestones_project_id").on(table.projectId),
    index("idx_billing_milestones_status").on(table.status),
    index("idx_billing_milestones_scheduled_date").on(table.scheduledDate),
  ]
);

// ============================================
// Proposals
// ============================================

export const proposalStatusEnum = pgEnum("proposal_status", [
  "draft",
  "reviewed",
  "sent",
  "accepted",
  "rejected",
]);

export const proposals = pgTable(
  "proposals",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => clients.id, { onDelete: "cascade" }),
    intakeSubmissionId: uuid("intake_submission_id").references(
      () => intakeSubmissions.id,
      { onDelete: "set null" }
    ),
    title: varchar("title", { length: 255 }).notNull(),
    summary: text("summary").notNull(),
    content: text("content").notNull(),
    services: jsonb("services")
      .$type<
        {
          serviceId: string;
          serviceName: string;
          description: string;
          estimatedPriceCents: number;
          estimatedTimeline: string;
        }[]
      >()
      .default([]),
    estimatedBudgetCents: integer("estimated_budget_cents"),
    timeline: varchar("timeline", { length: 255 }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    status: proposalStatusEnum("status").notNull().default("draft"),
    generatedBy: uuid("generated_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedBy: uuid("reviewed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    responseToken: varchar("response_token", { length: 64 }).unique(),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    rejectionReason: text("rejection_reason"),
    nudgedAt: timestamp("nudged_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_proposals_client_id").on(table.clientId),
    index("idx_proposals_intake_submission_id").on(table.intakeSubmissionId),
    index("idx_proposals_status").on(table.status),
    index("idx_proposals_generated_by").on(table.generatedBy),
    index("idx_proposals_response_token").on(table.responseToken),
  ]
);

// ============================================
// Relations
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  assignedClients: many(clients),
  authoredNotes: many(clientNotes),
  assignedProjects: many(projects),
  generatedProposals: many(proposals, { relationName: "generatedProposals" }),
  reviewedProposals: many(proposals, { relationName: "reviewedProposals" }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  assignedUser: one(users, {
    fields: [clients.assignedTo],
    references: [users.id],
  }),
  notes: many(clientNotes),
  pipelineHistory: many(pipelineHistory),
  projects: many(projects),
  invoices: many(invoices),
  proposals: many(proposals),
}));

export const pipelineHistoryRelations = relations(
  pipelineHistory,
  ({ one }) => ({
    client: one(clients, {
      fields: [pipelineHistory.clientId],
      references: [clients.id],
    }),
    changedByUser: one(users, {
      fields: [pipelineHistory.changedBy],
      references: [users.id],
    }),
  })
);

export const clientNotesRelations = relations(clientNotes, ({ one }) => ({
  client: one(clients, {
    fields: [clientNotes.clientId],
    references: [clients.id],
  }),
  author: one(users, {
    fields: [clientNotes.authorId],
    references: [users.id],
  }),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  client: one(clients, {
    fields: [projects.clientId],
    references: [clients.id],
  }),
  assignedUser: one(users, {
    fields: [projects.assignedTo],
    references: [users.id],
  }),
  invoices: many(invoices),
  milestones: many(billingMilestones),
  proposal: one(proposals, {
    fields: [projects.proposalId],
    references: [proposals.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  client: one(clients, {
    fields: [invoices.clientId],
    references: [clients.id],
  }),
  project: one(projects, {
    fields: [invoices.projectId],
    references: [projects.id],
  }),
  items: many(invoiceItems),
  milestone: one(billingMilestones, {
    fields: [invoices.milestoneId],
    references: [billingMilestones.id],
  }),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, {
    fields: [invoiceItems.invoiceId],
    references: [invoices.id],
  }),
}));

export const billingMilestonesRelations = relations(
  billingMilestones,
  ({ one }) => ({
    project: one(projects, {
      fields: [billingMilestones.projectId],
      references: [projects.id],
    }),
    invoice: one(invoices, {
      fields: [billingMilestones.invoiceId],
      references: [invoices.id],
    }),
  })
);

// ============================================
// Site Settings (key-value)
// ============================================

export const siteSettings = pgTable("site_settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ============================================
// Relations
// ============================================

export const proposalsRelations = relations(proposals, ({ one }) => ({
  client: one(clients, {
    fields: [proposals.clientId],
    references: [clients.id],
  }),
  intakeSubmission: one(intakeSubmissions, {
    fields: [proposals.intakeSubmissionId],
    references: [intakeSubmissions.id],
  }),
  generatedByUser: one(users, {
    fields: [proposals.generatedBy],
    references: [users.id],
    relationName: "generatedProposals",
  }),
  reviewedByUser: one(users, {
    fields: [proposals.reviewedBy],
    references: [users.id],
    relationName: "reviewedProposals",
  }),
}));
