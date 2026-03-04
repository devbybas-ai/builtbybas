CREATE TYPE "public"."intake_status" AS ENUM('new', 'reviewed', 'accepted', 'rejected', 'converted');--> statement-breakpoint
ALTER TABLE "intake_submissions" ADD COLUMN "status" "intake_status" DEFAULT 'new' NOT NULL;--> statement-breakpoint
CREATE INDEX "idx_intake_submissions_status" ON "intake_submissions" USING btree ("status");