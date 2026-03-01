import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  index,
  integer,
  jsonb,
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

export const clients = pgTable(
  "clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
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

export const intakeSubmissions = pgTable(
  "intake_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    company: varchar("company", { length: 255 }).notNull(),
    complexityScore: integer("complexity_score"),
    primaryService: varchar("primary_service", { length: 255 }),
    formData: jsonb("form_data").notNull(),
    analysis: jsonb("analysis").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_intake_submissions_email").on(table.email),
    index("idx_intake_submissions_submitted_at").on(table.submittedAt),
  ]
);

// ============================================
// Relations
// ============================================

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  assignedClients: many(clients),
  authoredNotes: many(clientNotes),
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
