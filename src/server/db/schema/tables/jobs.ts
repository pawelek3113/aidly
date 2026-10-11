import {
  boolean,
  date,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import {
  jobContractEnum,
  jobLevelEnum,
  offerStatusEnum,
  workModeEnum,
} from "../enums";
import { user } from "./auth";

export const salaryCurrency = pgTable("salary_currency", {
  id: uuid().primaryKey().defaultRandom(),
  currency: text().notNull().unique(),
});

export const jobSalary = pgTable("job_salary", {
  id: uuid().primaryKey().defaultRandom(),
  value: integer().notNull(),
  currencyId: uuid("currency_id")
    .notNull()
    .references(() => salaryCurrency.id, { onDelete: "restrict" }),
  jobId: uuid("job_id").references(() => jobOffer.id, {
    onDelete: "cascade",
  }),
});

export const jobCompany = pgTable("job_company", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  image: text(),
});

export const jobOfferAddress = pgTable("job_offer_address", {
  id: uuid().primaryKey().defaultRandom(),
  street: text("street"),
  streetNumber: text("street_number"),
  apartmentNumber: text("apartment_number"),
  city: text("city"),
  country: text("country"),
});

export const skill = pgTable("job_offer_skill", {
  id: uuid().primaryKey().defaultRandom(),
  title: text().notNull().unique(),
});

export const jobOfferSkill = pgTable(
  "job_offer_skill_junc",
  {
    offerId: uuid("offer_id")
      .notNull()
      .references(() => jobOffer.id, { onDelete: "cascade" }),
    skillId: uuid("skill_id")
      .notNull()
      .references(() => skill.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.offerId, t.skillId] })]
);

export const jobOffer = pgTable("job_offer", {
  id: uuid().primaryKey().defaultRandom(),
  role: text().notNull(),
  companyId: uuid("company_id")
    .notNull()
    .references(() => jobCompany.id, { onDelete: "set null" }),
  url: text(),
  portal: text(),
  notes: text(),
  addressId: uuid("address_id").references(() => jobOfferAddress.id, {
    onDelete: "set null",
  }),

  workMode: workModeEnum("work_mode").default("remote").notNull(),
  interviewCount: integer("interview_count").default(0).notNull(),
  status: offerStatusEnum().notNull(),

  contract: jobContractEnum().default("mandate").notNull(),
  level: jobLevelEnum().default("junior").notNull(),

  isFavorite: boolean("is_favorite").notNull().default(false),

  feedback: text(),
  expirationDate: date("expiration_date", { mode: "date" }),
  image: text(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type WorkMode = (typeof workModeEnum.enumValues)[number];
export type Status = (typeof offerStatusEnum.enumValues)[number];
export type Contract = (typeof jobContractEnum.enumValues)[number];
export type Level = (typeof jobLevelEnum.enumValues)[number];
