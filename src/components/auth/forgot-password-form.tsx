"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import z from "zod";
import { BrandHeading } from "../brand/brand-heading";
import { Button } from "../ui/button";
import { FORM_CLASSNAME } from "./auth-page";

type ForgotPasswordFormProps = {
  className?: HTMLFormElement["className"];
};

export const ForgotPasswordForm = ({ className }: ForgotPasswordFormProps) => {
  const t = useTranslations("AuthForm");
  const formSchema = useMemo(
    () =>
      z.object({
        email: z.email({ error: t("errors.email") }),
      }),
    [t]
  );

  type ForgotPasswordFormData = z.infer<typeof formSchema>;
  const { control, handleSubmit, setError, formState } =
    useForm<ForgotPasswordFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
      },
      mode: "onTouched",
    });

  const onSubmit = async ({ email }: ForgotPasswordFormData) => {
    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    });

    if (error?.code) {
      setError(
        "email",
        {
          message: t("errors.general", { code: error?.code ?? error.status }),
        },
        { shouldFocus: true }
      );
    }
  };

  return (
    <>
      {formState.isSubmitted ? (
        <div className="flex flex-col items-center gap-2.5">
          <BrandHeading text={t("forgot_password.heading")} />
          <BrandHeading
            text={t("forgot_password.subheading")}
            size="medium"
            className="text-center"
          />
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn(FORM_CLASSNAME, className)}
        >
          <div className="flex flex-col items-center">
            <BrandHeading text={t("forgot_pswd_heading")} />
            <BrandHeading text={t("forgot_pswd_subheading")} size="medium" />
          </div>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="joe@acme.com"
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" disabled={formState.isSubmitting}>
            {t("reset_password")}
          </Button>
        </form>
      )}
    </>
  );
};
