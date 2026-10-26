ALTER TABLE "job_offer_skill" ADD COLUMN "image" text;--> statement-breakpoint
ALTER TABLE "job_salary" ADD CONSTRAINT "job_salary_job_id_key" UNIQUE("job_id");