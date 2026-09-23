import { Locale } from "@/i18n/locales";
import { sendMail } from "./send";
import ResetPasswordMail from "./templates/password-reset";
import VerificationOtpEmail from "./templates/verification";

type MailProps = {
  email: string;
  title: string;
  locale?: Locale;
};

type sendVerificationOTPMailProps = {
  otp: string;
} & MailProps;

type sendResetPasswordMailProps = {
  url: string;
  token: string;
} & MailProps;

export const sendVerificationOTPMail = async ({
  email,
  otp,
  title,
  locale,
}: sendVerificationOTPMailProps) => {
  sendMail({
    from: "aidly verifications <verify@pawelkomendera.me>",
    to: email,
    subject: title,
    react: VerificationOtpEmail({ otp, locale }),
  });
};

export const sendResetPasswordMail = async ({
  email,
  title,
  locale,
  url,
  token,
}: sendResetPasswordMailProps) => {
  sendMail({
    from: "aidly password reset <reset@pawelkomendera.me>",
    to: email,
    subject: title,
    react: ResetPasswordMail({ locale, url, token }),
  });
};
