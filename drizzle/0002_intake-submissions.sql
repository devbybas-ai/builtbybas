CREATE TABLE "intake_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"complexity_score" integer,
	"primary_service" varchar(255),
	"form_data" jsonb NOT NULL,
	"analysis" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_intake_submissions_email" ON "intake_submissions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_intake_submissions_submitted_at" ON "intake_submissions" USING btree ("submitted_at");