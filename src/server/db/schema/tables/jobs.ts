import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const jobCompany = pgTable("job_company", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  image: text("image"),
});

export const jobOfferAddress = pgTable("job_offer_address", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  street: text("street"),
  streetNumber: text("street_number"),
  apartmentNumber: text("apartment_number"),
  city: text("city"),
  country: text("country"),
});

export const jobOffer = pgTable("job_offer", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  role: text("role").notNull(),
  companyId: text("company_id")
    .notNull()
    .references(() => jobCompany.id),
  url: text("url").notNull(),
  notes: text("notes"),
  addressId: text("address_id").references(() => jobOfferAddress.id, {
    onDelete: "set null",
  }),
  isRemote: boolean("is_remote").default(false).notNull(),
  image: text("image"),
  hasApplied: boolean("has_applied").default(false).notNull(),
  ghosted: boolean("ghosted").default(false).notNull(),
  interviewCount: integer("interview_count").default(0).notNull(),
  hired: boolean("hired").default(false).notNull(),
  rejected: boolean("rejected").default(false).notNull(),

  // expiryDate

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});
