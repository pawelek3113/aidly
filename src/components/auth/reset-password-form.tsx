"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { TOAST_TYPES } from "@/lib/toast-variants";
import { showToast, TOAST_DURATION } from "@/lib/toasts";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import z from "zod";
import { Button } from "../ui/button";
import { PasswordInput } from "../ui/input-password";
import { FORM_CLASSNAME } from "./auth-page";
import { BrandHeading } from "../brand/brand-heading";

type ResetPasswordFormProps = {
  token: string;
  className?: HTMLFormElement["className"];
};

export const ResetPasswordForm = ({
  token,
  className,
}: ResetPasswordFormProps) => {
  const t = useTranslations("AuthForm");
  const formSchema = useMemo(
    () =>
      z.object({
        password: z
          .string()
          .nonempty(t("errors.password.nonempty"))
          .min(8, t("errors.password.min")),
      }),
    [t]
  );

  type ForgotPasswordFormData = z.infer<typeof formSchema>;
  const { control, handleSubmit, setError, formState } =
    useForm<ForgotPasswordFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        password: "",
      },
      mode: "onTouched",
    });

  const router = useRouter();

  const onSubmit = async ({ password }: ForgotPasswordFormData) => {
    const { error } = await authClient.resetPassword({
      newPassword: password,
      token,
    });

    if (error?.code === "INVALID_TOKEN") {
      showToast({
        title: t("toasts.reset_password.error.title"),
        description: t("toasts.reset_password.error.description"),
        type: TOAST_TYPES.error,
        opts: {
          timeout: TOAST_DURATION.LONG,
        },
      });
      router.replace("/");
    }
    if (error) {
      setError(
        "password",
        {
          message: t("errors.general", { code: error?.code ?? error.status }),
        },
        { shouldFocus: true }
      );
    } else {
      showToast({
        title: t("toasts.reset_password.success.title"),
        description: t("toasts.reset_password.success.description"),
        type: TOAST_TYPES.success,
      });
      router.push("/sign-in");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(FORM_CLASSNAME, className)}
    >
      <BrandHeading text={t("reset_password_heading")} />
      <Controller
        name="password"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
            <PasswordInput
              {...field}
              id="password"
              aria-invalid={fieldState.invalid}
              autoComplete="new-password"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" disabled={formState.isSubmitting}>
        {t("reset_password")}
      </Button>
    </form>
  );
};
