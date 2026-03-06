ALTER TABLE "proposals" ADD COLUMN "response_token" varchar(64);--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "responded_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "proposals" ADD COLUMN "nudged_at" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_proposals_response_token" ON "proposals" USING btree ("response_token");--> statement-breakpoint
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_response_token_unique" UNIQUE("response_token");