CREATE TYPE "public"."proposal_status" AS ENUM('draft', 'reviewed', 'sent', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "proposals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"intake_submission_id" uuid,
	"title" varchar(255) NOT NULL,
	"summary" text NOT NULL,
	"content" text NOT NULL,
	"services" jsonb DEFAULT '[]'::jsonb,
	"estimated_budget_cents" integer,
	"timeline" varchar(255),
	"valid_until" timestamp with time zone,
	"status" "proposal_status" DEFAULT 'draft' NOT NULL,
	"generated_by" uuid,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"sent_at" timestamp with time zone,
	"accepted_at" timestamp with time zone,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_intake_submission_id_intake_submissions_id_fk" FOREIGN KEY ("intake_submission_id") REFERENCES "public"."intake_submissions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_generated_by_users_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_proposals_client_id" ON "proposals" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "idx_proposals_intake_submission_id" ON "proposals" USING btree ("intake_submission_id");--> statement-breakpoint
CREATE INDEX "idx_proposals_status" ON "proposals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_proposals_generated_by" ON "proposals" USING btree ("generated_by");