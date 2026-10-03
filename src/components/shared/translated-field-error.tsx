"use client";
import { FieldError } from "@/components/ui/field";
import { useTranslations } from "next-intl";
import type { FieldError as RHFFieldError } from "react-hook-form";

type TranslatedFieldErrorProps = {
  error?: RHFFieldError;
  translationNamespace?: string;
};

export function TranslatedFieldError({
  error,
  translationNamespace,
}: TranslatedFieldErrorProps) {
  const t = useTranslations(translationNamespace);
  if (!error?.message) return null;

  return <FieldError errors={[{ message: t(error.message) }]} />;
}
