CREATE TABLE "job_company" (
	"id" text PRIMARY KEY,
	"name" text NOT NULL,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "job_offer" (
	"id" text PRIMARY KEY,
	"role" text NOT NULL,
	"company_id" text NOT NULL,
	"url" text NOT NULL,
	"notes" text,
	"address_id" text,
	"is_remote" boolean DEFAULT false NOT NULL,
	"image" text,
	"has_applied" boolean DEFAULT false NOT NULL,
	"ghosted" boolean DEFAULT false NOT NULL,
	"interview_count" integer DEFAULT 0 NOT NULL,
	"hired" boolean DEFAULT false NOT NULL,
	"rejected" boolean DEFAULT false NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_offer_address" (
	"id" text PRIMARY KEY,
	"street" text,
	"street_number" text,
	"apartment_number" text,
	"city" text,
	"country" text
);
--> statement-breakpoint
ALTER TABLE "job_offer" ADD CONSTRAINT "job_offer_company_id_job_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "job_company"("id");--> statement-breakpoint
ALTER TABLE "job_offer" ADD CONSTRAINT "job_offer_address_id_job_offer_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "job_offer_address"("id") ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE "job_offer" ADD CONSTRAINT "job_offer_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;