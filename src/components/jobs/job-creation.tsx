"use client";

import {
  CreateJobOfferInput,
  createJobOfferSchema,
} from "@/lib/schemas/job-offer";
import { TOAST_TYPES } from "@/lib/toast-variants";
import { showToast } from "@/lib/toasts";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon } from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { BrandHeading } from "../brand/brand-heading";
import { TranslatedFieldError } from "../shared/translated-field-error";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

export const JobCreation = () => {
  const t = useTranslations("");

  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();

  const createJobOffer = useMutation(
    trpc.jobs.add.mutationOptions({
      onSuccess: (_id) => {
        queryClient.invalidateQueries(trpc.jobs.pathFilter());
        showToast({
          title: t("toasts.jobs.offer.create.success"),
          type: TOAST_TYPES.success,
        });
        router.push("/jobs");
      },
      onError: (err) => {
        showToast({
          title: t("toasts.jobs.offer.create.error"),
          description: t(err.message),
          type: TOAST_TYPES.success,
        });
      },
    })
  );

  const { control, handleSubmit, formState } = useForm<CreateJobOfferInput>({
    resolver: zodResolver(createJobOfferSchema),
    defaultValues: {
      role: "",
      company: {
        name: "",
      },
      address: {
        street: "",
        streetNumber: "",
        apartmentNumber: "",
        city: "",
        country: "",
      },
      url: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (values: CreateJobOfferInput) => {
    createJobOffer.mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex max-w-5xl flex-col gap-4"
    >
      <BrandHeading text={t("jobs.create.heading")} size="gigantic" />
      <Controller
        name="role"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="role">
              {t("jobs.create.form.labels.role")}
            </FieldLabel>
            <Input
              {...field}
              id="role"
              aria-invalid={fieldState.invalid}
              placeholder={t("jobs.create.form.placeholders.role")}
            />
            {fieldState.invalid && (
              <TranslatedFieldError error={fieldState.error} />
            )}
          </Field>
        )}
      />
      <Controller
        name="url"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="url">
              {t("jobs.create.form.labels.url")}
            </FieldLabel>
            <Input
              {...field}
              id="url"
              aria-invalid={fieldState.invalid}
              placeholder={t("jobs.create.form.placeholders.url")}
            />
            {fieldState.invalid && (
              <TranslatedFieldError error={fieldState.error} />
            )}
          </Field>
        )}
      />
      <Controller
        name="company.name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="company.name">
              {t("jobs.create.form.labels.companyName")}
            </FieldLabel>
            <Input
              {...field}
              id="company.name"
              aria-invalid={fieldState.invalid}
              placeholder={t("jobs.create.form.placeholders.companyName")}
            />
            {fieldState.invalid && (
              <TranslatedFieldError error={fieldState.error} />
            )}
          </Field>
        )}
      />

      <Button
        type="submit"
        disabled={formState.isSubmitting}
        size="lg"
        className="w-fit"
      >
        <PlusIcon weight="bold" />
        {t("jobs.create.form.labels.submit")}
      </Button>
    </form>
  );
};
