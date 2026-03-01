CREATE TYPE "public"."client_note_type" AS ENUM('general', 'call', 'email', 'meeting', 'internal');--> statement-breakpoint
CREATE TYPE "public"."client_status" AS ENUM('active', 'archived', 'lost');--> statement-breakpoint
CREATE TYPE "public"."pipeline_stage" AS ENUM('lead', 'intake_submitted', 'analysis_complete', 'fit_assessment', 'proposal_draft', 'proposal_sent', 'proposal_accepted', 'contract_signed', 'project_planning', 'in_progress', 'delivered', 'completed');--> statement-breakpoint
CREATE TABLE "client_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"author_id" uuid NOT NULL,
	"type" "client_note_type" DEFAULT 'general' NOT NULL,
	"content" varchar(5000) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"company" varchar(255) NOT NULL,
	"industry" varchar(100),
	"website" varchar(500),
	"pipeline_stage" "pipeline_stage" DEFAULT 'lead' NOT NULL,
	"stage_changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"intake_submission_id" varchar(100),
	"source" varchar(100),
	"status" "client_status" DEFAULT 'active' NOT NULL,
	"assigned_to" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pipeline_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"from_stage" "pipeline_stage",
	"to_stage" "pipeline_stage" NOT NULL,
	"changed_by" uuid,
	"note" varchar(500),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "client_notes" ADD CONSTRAINT "client_notes_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_notes" ADD CONSTRAINT "client_notes_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_history" ADD CONSTRAINT "pipeline_history_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pipeline_history" ADD CONSTRAINT "pipeline_history_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_client_notes_client_id" ON "client_notes" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_client_notes_author_id" ON "client_notes" USING btree ("author_id");--> statement-breakpoint
CREATE INDEX "idx_clients_pipeline_stage" ON "clients" USING btree ("pipeline_stage");--> statement-breakpoint
CREATE INDEX "idx_clients_status" ON "clients" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_clients_assigned_to" ON "clients" USING btree ("assigned_to");--> statement-breakpoint
CREATE INDEX "idx_clients_email" ON "clients" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_pipeline_history_client_id" ON "pipeline_history" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_pipeline_history_changed_by" ON "pipeline_history" USING btree ("changed_by");