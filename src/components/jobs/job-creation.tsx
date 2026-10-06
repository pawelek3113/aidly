"use client";

import {
  CreateJobOfferInput,
  createJobOfferSchema,
} from "@/lib/schemas/job-offer";
import { TOAST_TYPES } from "@/lib/toast-variants";
import { showToast } from "@/lib/toasts";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GhostIcon,
  PlusIcon,
  ReadCvLogoIcon,
  SmileySadIcon,
} from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { BrandHeading } from "../brand/brand-heading";
import { Section } from "../shared/section";
import { TranslatedFieldError } from "../shared/translated-field-error";
import { Button } from "../ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { DetailTile } from "./detail-tile";

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
          title: t("toasts.jobs.offer.create.success.title"),
          type: TOAST_TYPES.success,
        });
        router.push("/jobs");
      },
      onError: (err) => {
        showToast({
          title: t("toasts.jobs.offer.create.error.title"),
          description: t(err.message),
          type: TOAST_TYPES.success,
        });
      },
    })
  );

  const [interviewHappened, setInterviewHappened] = useState(false);

  const { control, handleSubmit, formState, setValue, setValues, resetField } =
    useForm<CreateJobOfferInput>({
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
        notes: "",
        isRemote: true,
        hasApplied: false,
        ghosted: false,
        interviewCount: 0,
        hired: false,
        rejected: false,
      },
      mode: "onTouched",
    });

  const hasApplied = useWatch({ control, name: "hasApplied" });

  const onSubmit = (values: CreateJobOfferInput) => {
    createJobOffer.mutate(values);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-5xl flex-col gap-4 px-5 md:px-0"
    >
      <BrandHeading
        text={t("jobs.create.heading")}
        size="gigantic"
        variant="pageHeading"
      />
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
              autoComplete="off"
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
              autoComplete="off"
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
              autoComplete="off"
              aria-invalid={fieldState.invalid}
              placeholder={t("jobs.create.form.placeholders.companyName")}
            />
            {fieldState.invalid && (
              <TranslatedFieldError error={fieldState.error} />
            )}
          </Field>
        )}
      />

      <Section
        heading={t("jobs.create.form.labels.address.sectionHeading")}
        rightArrow
        clickable
        contentClassName="gap-4"
      >
        <div className="flex flex-col gap-4 md:flex-row">
          <Controller
            name="address.city"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address.city">
                  {t("jobs.create.form.labels.address.city")}
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="address.city"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder={t("jobs.create.form.placeholders.address.city")}
                />
                {fieldState.invalid && (
                  <TranslatedFieldError error={fieldState.error} />
                )}
              </Field>
            )}
          />
          <Controller
            name="address.country"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address.country">
                  {t("jobs.create.form.labels.address.country")}
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="address.country"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder={t(
                    "jobs.create.form.placeholders.address.country"
                  )}
                />
                {fieldState.invalid && (
                  <TranslatedFieldError error={fieldState.error} />
                )}
              </Field>
            )}
          />
        </div>
        <Controller
          name="address.street"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="address.street">
                {t("jobs.create.form.labels.address.street")}
              </FieldLabel>
              <Input
                {...field}
                value={field.value ?? ""}
                id="address.street"
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                placeholder={t("jobs.create.form.placeholders.address.street")}
              />
              {fieldState.invalid && (
                <TranslatedFieldError error={fieldState.error} />
              )}
            </Field>
          )}
        />
        <div className="flex flex-col gap-4 md:flex-row">
          <Controller
            name="address.streetNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address.streetNumber">
                  {t("jobs.create.form.labels.address.streetNumber")}
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="address.streetNumber"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder={t(
                    "jobs.create.form.placeholders.address.streetNumber"
                  )}
                />
                {fieldState.invalid && (
                  <TranslatedFieldError error={fieldState.error} />
                )}
              </Field>
            )}
          />
          <Controller
            name="address.apartmentNumber"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="address.apartmentNumber">
                  {t("jobs.create.form.labels.address.apartmentNumber")}
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="address.apartmentNumber"
                  autoComplete="off"
                  aria-invalid={fieldState.invalid}
                  placeholder={t(
                    "jobs.create.form.placeholders.address.apartmentNumber"
                  )}
                />
                {fieldState.invalid && (
                  <TranslatedFieldError error={fieldState.error} />
                )}
              </Field>
            )}
          />
        </div>
      </Section>

      <Controller
        name="isRemote"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className="max-w-fit flex-row items-center gap-4"
          >
            <FieldLabel htmlFor="isRemote">
              {t("jobs.create.form.labels.isRemote")}
            </FieldLabel>
            <Switch
              id="isRemote"
              ref={field.ref}
              onBlur={field.onBlur}
              checked={field.value}
              onCheckedChange={field.onChange}
            />

            {fieldState.invalid && (
              <TranslatedFieldError error={fieldState.error} />
            )}
          </Field>
        )}
      />

      <Section
        className="border-chocolate-border bg-chocolate-muted gap-5 rounded-4xl border-8 p-7 px-9"
        heading={t("jobs.create.form.labels.application.heading")}
        nonExpandable
        headingClassName="text-brand-secondary"
        contentClassName="gap-4"
      >
        <Controller
          name="hasApplied"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="max-w-fit flex-row items-center gap-4"
            >
              <FieldLabel htmlFor="hasApplied">
                {t("jobs.create.form.labels.application.hasApplied")}
              </FieldLabel>
              <Switch
                id="hasApplied"
                ref={field.ref}
                onBlur={field.onBlur}
                checked={field.value}
                onCheckedChange={(checked) => {
                  if (!checked) {
                    setInterviewHappened(checked);
                    resetField("interviewCount");
                    resetField("ghosted");
                    resetField("rejected");
                    resetField("hired");
                  }

                  field.onChange(checked);
                }}
              />

              {fieldState.invalid && (
                <TranslatedFieldError error={fieldState.error} />
              )}
            </Field>
          )}
        />

        {hasApplied && (
          <>
            <div
              className="flex max-w-fit flex-row items-center gap-4"
              data-slot="field"
            >
              <FieldLabel>
                {t("jobs.create.form.labels.application.interview.happened")}
              </FieldLabel>
              <Switch
                checked={interviewHappened}
                onCheckedChange={(checked) => {
                  setValue("interviewCount", Number(checked), {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setInterviewHappened(checked);
                }}
              />
            </div>

            {interviewHappened && (
              <Controller
                name="interviewCount"
                control={control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="max-w-fit flex-row items-center gap-4"
                  >
                    <FieldLabel htmlFor="interviewCount">
                      {t("jobs.create.form.labels.application.interview.count")}
                    </FieldLabel>

                    <Input
                      {...field}
                      onChange={(e) => {
                        const v = e.target.valueAsNumber;
                        field.onChange(Number.isNaN(v) ? undefined : v);
                      }}
                      value={field.value ?? ""}
                      id="interviewCount"
                      autoComplete="off"
                      aria-invalid={fieldState.invalid}
                      placeholder={"1"}
                      type="number"
                    />

                    {fieldState.invalid && (
                      <TranslatedFieldError error={fieldState.error} />
                    )}
                  </Field>
                )}
              />
            )}

            <div className="flex flex-wrap gap-4">
              <Controller
                name="ghosted"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-fit">
                    <DetailTile
                      id="ghosted"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValues(
                            { hired: false, rejected: false },
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            }
                          );
                        }
                        field.onChange(checked);
                      }}
                      icon={
                        <GhostIcon className="size-full" weight="duotone" />
                      }
                      label={t("jobs.create.form.labels.application.ghosted")}
                    />
                    {fieldState.invalid && (
                      <TranslatedFieldError error={fieldState.error} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="rejected"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-fit">
                    <DetailTile
                      id="rejected"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValues(
                            { hired: false, ghosted: false },
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            }
                          );
                        }
                        field.onChange(checked);
                      }}
                      icon={
                        <SmileySadIcon className="size-full" weight="duotone" />
                      }
                      label={t("jobs.create.form.labels.application.rejected")}
                    />
                    {fieldState.invalid && (
                      <TranslatedFieldError error={fieldState.error} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="hired"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-fit">
                    <DetailTile
                      id="hired"
                      ref={field.ref}
                      onBlur={field.onBlur}
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValues(
                            { rejected: false, ghosted: false },
                            {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            }
                          );
                        }
                        field.onChange(checked);
                      }}
                      icon={
                        <ReadCvLogoIcon
                          className="size-full"
                          weight="duotone"
                        />
                      }
                      label={t("jobs.create.form.labels.application.hired")}
                    />
                    {fieldState.invalid && (
                      <TranslatedFieldError error={fieldState.error} />
                    )}
                  </Field>
                )}
              />
            </div>
          </>
        )}
      </Section>

      <Controller
        name="notes"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="notes">
              {t("jobs.create.form.labels.notes")}
            </FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ""}
              id="notes"
              aria-invalid={fieldState.invalid}
              className="resize-y"
            />
            {fieldState.invalid && (
              <TranslatedFieldError error={fieldState.error} />
            )}
          </Field>
        )}
      />

      <div className="pt-4">
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          size="lg"
          className="w-fit"
        >
          <PlusIcon weight="bold" />
          {t("jobs.create.form.labels.submit")}
        </Button>
      </div>
    </form>
  );
};
