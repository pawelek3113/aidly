ALTER TABLE "job_offer" 
ALTER COLUMN "expiration_date" 
SET DATA TYPE timestamp with time zone 
USING (expiration_date + time '23:59:59.999') AT TIME ZONE 'Europe/Warsaw';