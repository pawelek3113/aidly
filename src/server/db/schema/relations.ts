import { defineRelations } from "drizzle-orm";
import {
  account,
  jobCompany,
  jobOffer,
  jobOfferAddress,
  jobOfferSkill,
  jobSalary,
  salaryCurrency,
  session,
  skill,
  user,
  verification,
} from "./tables";

export const relations = defineRelations(
  {
    user,
    session,
    account,
    verification,
    jobOffer,
    jobCompany,
    jobOfferAddress,
    skill,
    jobOfferSkill,
    jobSalary,
    salaryCurrency,
  },
  (r) => ({
    user: {
      sessions: r.many.session({
        from: r.user.id,
        to: r.session.userId,
      }),
      accounts: r.many.account({
        from: r.user.id,
        to: r.account.userId,
      }),
      jobOffers: r.many.jobOffer({
        from: r.user.id,
        to: r.jobOffer.userId,
      }),
    },
    session: {
      user: r.one.user({
        from: r.session.userId,
        to: r.user.id,
      }),
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },
    jobOffer: {
      user: r.one.user({
        from: r.jobOffer.userId,
        to: r.user.id,
      }),
      jobCompany: r.one.jobCompany({
        from: r.jobOffer.companyId,
        to: r.jobCompany.id,
      }),
      jobOfferAddress: r.one.jobOfferAddress({
        from: r.jobOffer.addressId,
        to: r.jobOfferAddress.id,
      }),
      skills: r.many.skill({
        from: r.jobOffer.id.through(r.jobOfferSkill.offerId),
        to: r.skill.id.through(r.jobOfferSkill.skillId),
      }),
      salary: r.one.jobSalary({
        from: r.jobOffer.id,
        to: r.jobSalary.jobId,
      }),
    },
    jobSalary: {
      jobOffer: r.one.jobOffer({
        from: r.jobSalary.jobId,
        to: r.jobOffer.id,
      }),
      currency: r.one.salaryCurrency({
        from: r.jobSalary.currencyId,
        to: r.salaryCurrency.id,
      }),
    },
    salaryCurrency: {
      jobSalaries: r.many.jobSalary(),
    },
    skill: {
      jobOffers: r.many.jobOffer({
        from: r.skill.id.through(r.jobOfferSkill.skillId),
        to: r.jobOffer.id.through(r.jobOfferSkill.offerId),
      }),
    },
    jobCompany: {
      jobOffers: r.many.jobOffer({
        from: r.jobCompany.id,
        to: r.jobOffer.companyId,
      }),
    },
    jobOfferAddress: {
      jobOffer: r.many.jobOffer({
        from: r.jobOfferAddress.id,
        to: r.jobOffer.addressId,
      }),
    },
  })
);
