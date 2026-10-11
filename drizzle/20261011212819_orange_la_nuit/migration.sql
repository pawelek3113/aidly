CREATE TYPE "contract_enum" AS ENUM('mandate', 'employment', 'specific_work', 'B2B');--> statement-breakpoint
CREATE TYPE "job_level_enum" AS ENUM('junior', 'mid', 'senior');--> statement-breakpoint
CREATE TYPE "offer_status_enum" AS ENUM('saved', 'applied', 'interviewed', 'rejected', 'hired', 'ghosted');--> statement-breakpoint
CREATE TYPE "work_mode_enum" AS ENUM('remote', 'on_site', 'hybrid');--> statement-breakpoint

ALTER TABLE "job_offer" DROP CONSTRAINT "job_offer_company_id_job_company_id_fkey";--> statement-breakpoint
ALTER TABLE "job_offer" DROP CONSTRAINT "job_offer_address_id_job_offer_address_id_fkey";--> statement-breakpoint

CREATE TABLE "job_offer_skill_junc" (
	"offer_id" uuid,
	"skill_id" uuid,
	CONSTRAINT "job_offer_skill_junc_pkey" PRIMARY KEY("offer_id","skill_id")
);
--> statement-breakpoint
CREATE TABLE "job_salary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"value" integer NOT NULL,
	"currency_id" uuid NOT NULL,
	"job_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "salary_currency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"currency" text NOT NULL UNIQUE
);
--> statement-breakpoint
CREATE TABLE "job_offer_skill" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL UNIQUE
);
--> statement-breakpoint
ALTER TABLE "job_offer" ADD COLUMN "portal" text;--> statement-breakpoint
ALTER TABLE "job_offer" ADD COLUMN "work_mode" "work_mode_enum" DEFAULT 'remote'::"work_mode_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "job_offer" ADD COLUMN "status" "offer_status_enum" DEFAULT 'saved'::"offer_status_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "job_offer" ADD COLUMN "contract" "contract_enum" DEFAULT 'mandate'::"contract_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "job_offer" ADD COLUMN "level" "job_level_enum" DEFAULT 'junior'::"job_level_enum" NOT NULL;--> statement-breakpoint
ALTER TABLE "job_offer" ADD COLUMN "is_favorite" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "job_offer" ADD COLUMN "feedback" text;--> statement-breakpoint
ALTER TABLE "job_offer" ADD COLUMN "expiration_date" date;--> statement-breakpoint

UPDATE "job_offer" SET "status" = (CASE
    WHEN "hired"              THEN 'hired'
    WHEN "rejected"           THEN 'rejected'
    WHEN "ghosted"            THEN 'ghosted'
    WHEN "interview_count" >= 1 THEN 'interviewed'
    WHEN "has_applied"        THEN 'applied'
    ELSE 'saved'
END)::"offer_status_enum";--> statement-breakpoint

UPDATE "job_offer" SET "work_mode" = 'on_site' WHERE "is_remote" = false;--> statement-breakpoint

ALTER TABLE "job_offer" DROP COLUMN "is_remote";--> statement-breakpoint
ALTER TABLE "job_offer" DROP COLUMN "has_applied";--> statement-breakpoint
ALTER TABLE "job_offer" DROP COLUMN "ghosted";--> statement-breakpoint
ALTER TABLE "job_offer" DROP COLUMN "hired";--> statement-breakpoint
ALTER TABLE "job_offer" DROP COLUMN "rejected";--> statement-breakpoint

ALTER TABLE "job_company" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "job_company" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "job_offer" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "job_offer" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "job_offer" ALTER COLUMN "company_id" SET DATA TYPE uuid USING "company_id"::uuid;--> statement-breakpoint
ALTER TABLE "job_offer" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "job_offer" ALTER COLUMN "address_id" SET DATA TYPE uuid USING "address_id"::uuid;--> statement-breakpoint
ALTER TABLE "job_offer_address" ALTER COLUMN "id" SET DATA TYPE uuid USING "id"::uuid;--> statement-breakpoint
ALTER TABLE "job_offer_address" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "job_offer_skill_junc" ADD CONSTRAINT "job_offer_skill_junc_offer_id_job_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "job_offer"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "job_offer_skill_junc" ADD CONSTRAINT "job_offer_skill_junc_skill_id_job_offer_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "job_offer_skill"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "job_salary" ADD CONSTRAINT "job_salary_currency_id_salary_currency_id_fkey" FOREIGN KEY ("currency_id") REFERENCES "salary_currency"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "job_salary" ADD CONSTRAINT "job_salary_job_id_job_offer_id_fkey" FOREIGN KEY ("job_id") REFERENCES "job_offer"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "job_offer" ADD CONSTRAINT "job_offer_company_id_job_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "job_company"("id") ON DELETE RESTRICT;--> statement-breakpoint
ALTER TABLE "job_offer" ADD CONSTRAINT "job_offer_address_id_job_offer_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "job_offer_address"("id") ON DELETE SET NULL;