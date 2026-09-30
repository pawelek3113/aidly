import { Locale } from "@/i18n/locales";
import { db } from "@/server/db";
import * as schema from "@/server/db/schema/tables";
import { drizzleAdapter } from "@better-auth/drizzle-adapter/relations-v2";
import { waitUntil } from "@vercel/functions";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { getLocale, getTranslations } from "next-intl/server";
import { getMailer } from "../mail/providers/mailer";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url, token }) => {
      const locale = (await getLocale()) as Locale;
      const t = await getTranslations();
      const title = t("emails.password_reset.title");

      const mailer = await getMailer();

      waitUntil(
        mailer.sendResetPasswordMail({
          email: user.email,
          title,
          locale,
          token,
          url,
        })
      );
    },
  },
  plugins: [
    emailOTP({
      sendVerificationOnSignUp: true,
      async sendVerificationOTP({ email, otp, type }) {
        const locale = (await getLocale()) as Locale;
        const t = await getTranslations();
        const title = t("emails.email_verification.title");

        if (type === "email-verification") {
          const mailer = await getMailer();

          waitUntil(
            mailer.sendVerificationOTPMail({ email, otp, title, locale })
          );
        }
      },
    }),
  ],
});
