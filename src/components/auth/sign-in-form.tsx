"use client";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import { ParagraphLink } from "../shared/para-with-link";
import { Button } from "../ui/button";
import { FORM_CLASSNAME } from "./auth-page";
import { PasswordInput } from "../ui/input-password";
import { BrandHeading } from "../brand/brand-heading";

type SignInFormProps = {
  className?: HTMLFormElement["className"];
};

export const SignInForm = ({ className }: SignInFormProps) => {
  const t = useTranslations("AuthForm");
  const formSchema = useMemo(
    () =>
      z.object({
        email: z.email({ error: t("errors.email") }),
        password: z
          .string()
          .nonempty(t("errors.password.nonempty"))
          .min(8, t("errors.password.min")),
      }),
    [t]
  );

  type SignInFormData = z.infer<typeof formSchema>;
  const { control, handleSubmit, setError, formState } =
    useForm<SignInFormData>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      },
      mode: "onTouched",
    });

  const router = useRouter();

  const onSubmit = async ({ email, password }: SignInFormData) => {
    const { data, error } = await authClient.signIn.email({ email, password });

    if (data?.user) {
      showToast({
        title: t("toasts.signin.success.title"),
        description: t("toasts.signin.success.description"),
        type: TOAST_TYPES.success,
      });
      router.push("/");
    }

    if (error?.code === "INVALID_EMAIL_OR_PASSWORD") {
      setError("email", { type: "value" });
      setError("password", {
        type: "value",
        message: t("errors.invalid_email_or_pswd"),
      });
    }
    if (error?.code && error?.code !== "INVALID_EMAIL_OR_PASSWORD") {
      setError("email", { type: "value" });
      setError(
        "password",
        {
          message: t("errors.general", { code: error?.code ?? error.status }),
        },
        { shouldFocus: true }
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(FORM_CLASSNAME, className)}
    >
      <BrandHeading text={t("login_heading")} />
      <Controller
        name="email"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
            <Input
              {...field}
              id="email"
              aria-invalid={fieldState.invalid}
              placeholder="joe@acme.com"
              autoComplete="email"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="flex w-full flex-col gap-1">
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
                autoComplete="current-password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <ParagraphLink
          translationKey="AuthForm.forgot_pswd"
          href="/forgot-password"
        />
      </div>
      <Button type="submit" disabled={formState.isSubmitting} size="lg">
        {t("login")}
      </Button>
      <ParagraphLink translationKey="AuthForm.no_account" href="/sign-up" />
    </form>
  );
};
