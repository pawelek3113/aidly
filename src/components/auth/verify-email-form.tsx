"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { TOAST_TYPES } from "@/lib/toast-variants";
import { showToast } from "@/lib/toasts";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import z from "zod";
import { BrandHeading } from "../brand/brand-heading";
import { useOtpCountdown } from "../hooks/use-otp-countdown";
import { Button } from "../ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

type VerifyEmailFormProps = {
  email: string;
  code: string | null;
  className?: string;
};

export const VerifyEmailForm = ({
  email,
  code,
  className,
}: VerifyEmailFormProps) => {
  const t = useTranslations("AuthForm");

  const { remaining, restart } = useOtpCountdown(300);
  const isExpired = remaining === 0;

  const router = useRouter();

  const formSchema = useMemo(
    () =>
      z.object({
        otp: z.stringFormat("otp", /^[0-9]{6}$/, { error: t("errors.otp") }),
      }),
    [t]
  );
  type VerifyEmailFormData = z.infer<typeof formSchema>;

  const { control, handleSubmit, setError, formState } =
    useForm<VerifyEmailFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        otp: code ?? "",
      },
    });

  const handleResend = async () => {
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });

    restart(300);
  };

  const onSubmit = async ({ otp }: VerifyEmailFormData) => {
    const { data, error } = await authClient.emailOtp.verifyEmail({
      otp,
      email,
    });

    if (data?.status) {
      showToast({
        title: t("code_verification.success.title"),
        description: t("code_verification.success.description"),
        type: TOAST_TYPES.success,
      });
      router.push("/");
    }
    if (error?.code === "INVALID_OTP") {
      setError(
        "otp",
        {
          message: t("errors.otp"),
        },
        { shouldFocus: true }
      );
    }

    if (error?.code && error?.code !== "INVALID_OTP") {
      setError(
        "otp",
        {
          message: t("errors.general", { code: error?.code ?? error.status }),
        },
        { shouldFocus: true }
      );
    }
  };

  return (
    <>
      {remaining ? (
        <p className={cn("font text-9xl font-thin tracking-tighter")}>
          {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}
        </p>
      ) : (
        <BrandHeading text={t("code_expired")} />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn("flex flex-col items-center gap-4", className)}
      >
        <Controller
          name="otp"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="otp">{t("otp")}</FieldLabel>
              <InputOTP
                {...field}
                id="otp"
                maxLength={6}
                autoComplete="one-time-code"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <div className="flex flex-row gap-2">
          <Button type="submit" disabled={formState.isSubmitting || isExpired}>
            {t("verify")}
          </Button>
          <Button type="button" onClick={handleResend} disabled={!isExpired}>
            {t("resend")}
          </Button>
        </div>
      </form>
    </>
  );
};
