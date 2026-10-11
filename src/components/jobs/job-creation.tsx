"use client";

import {
  CreateJobOfferInput,
  createJobOfferSchema,
  JobOfferFormInput,
} from "@/lib/schemas/job-offer";
import { TOAST_TYPES } from "@/lib/toast-variants";
import { showToast } from "@/lib/toasts";
import { cn } from "@/lib/utils";
import {
  jobContractEnum,
  jobLevelEnum,
  offerStatusEnum,
  workModeEnum,
} from "@/server/db/schema/enums";
import {
  Contract,
  Level,
  Status,
  type WorkMode,
} from "@/server/db/schema/tables";
import { useTRPC } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  FileTextIcon,
  GhostIcon,
  HandshakeIcon,
  HouseLineIcon,
  LeafIcon,
  OfficeChairIcon,
  PenNibIcon,
  PlantIcon,
  PlusIcon,
  ReadCvLogoIcon,
  SmileySadIcon,
  StarIcon,
  TreeIcon,
} from "@phosphor-icons/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { BrandHeading } from "../brand/brand-heading";
import { Section } from "../shared/section";
import { TranslatedFieldError } from "../shared/translated-field-error";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Field, FieldLabel, FieldLegend, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup } from "../ui/radio-group";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { DetailTile } from "./detail-tile";

type TerminalStatus = Extract<Status, "ghosted" | "hired" | "rejected">;
type InitialStatus = Extract<Status, "saved">;

const INITIAL_STATUS: InitialStatus = "saved";

const isTerminalStatus = (s: Status): s is TerminalStatus =>
  s in STATUS_LABELS_ICONS;

const LEVEL_LABELS_ICONS = {
  junior: {
    label: "jobs.create.form.labels.levels.junior",
    icon: <LeafIcon className="size-full" weight="duotone" />,
  },
  mid: {
    label: "jobs.create.form.labels.levels.mid",
    icon: <PlantIcon className="size-full" weight="duotone" />,
  },
  senior: {
    label: "jobs.create.form.labels.levels.senior",
    icon: <TreeIcon className="size-full" weight="duotone" />,
  },
} as const satisfies Record<Level, { label: string; icon: ReactNode }>;

const CONTRACT_LABELS_ICONS = {
  mandate: {
    label: "jobs.create.form.labels.contracts.mandate",
    icon: <FileTextIcon className="size-full" weight="duotone" />,
  },
  employment: {
    label: "jobs.create.form.labels.contracts.employment",
    icon: <BriefcaseIcon className="size-full" weight="duotone" />,
  },
  B2B: {
    label: "jobs.create.form.labels.contracts.b2b",
    icon: <HandshakeIcon className="size-full" weight="duotone" />,
  },
  specific_work: {
    label: "jobs.create.form.labels.contracts.specificWork",
    icon: <PenNibIcon className="size-full" weight="duotone" />,
  },
} as const satisfies Record<Contract, { label: string; icon: ReactNode }>;

const WORK_MODE_LABELS_ICONS = {
  remote: {
    label: "jobs.create.form.labels.workModes.remote",
    icon: <HouseLineIcon className="size-full" weight="duotone" />,
  },
  on_site: {
    label: "jobs.create.form.labels.workModes.onSite",
    icon: <BuildingOfficeIcon className="size-full" weight="duotone" />,
  },
  hybrid: {
    label: "jobs.create.form.labels.workModes.hybrid",
    icon: <OfficeChairIcon className="size-full" weight="duotone" />,
  },
} as const satisfies Record<WorkMode, { label: string; icon: ReactNode }>;

const STATUS_LABELS_ICONS = {
  ghosted: {
    label: "jobs.create.form.labels.application.ghosted",
    icon: <GhostIcon className="size-full" weight="duotone" />,
  },
  hired: {
    label: "jobs.create.form.labels.application.hired",
    icon: <ReadCvLogoIcon className="size-full" weight="duotone" />,
  },
  rejected: {
    label: "jobs.create.form.labels.application.rejected",
    icon: <SmileySadIcon className="size-full" weight="duotone" />,
  },
} as const satisfies Record<TerminalStatus, { label: string; icon: ReactNode }>;

// TODO: kick outta here

export const JobCreation = () => {
  const t = useTranslations();

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

  const { control, handleSubmit, formState, setValue, resetField } = useForm<
    JobOfferFormInput,
    unknown,
    CreateJobOfferInput
  >({
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
      notes: null,
      workMode: "remote",
      hasApplied: false,
      status: INITIAL_STATUS,
      interviewHappened: false,
      interviewCount: 0,
      contract: "mandate",
      expirationDate: null,
      feedback: null,
      isFavorite: false,
      level: "junior",
      salary: null,
      // TODO: skills
      // TODO: image
    },
    mode: "onTouched",
  });

  const hasApplied = useWatch({ control, name: "hasApplied" });
  const interviewHappened = useWatch({ control, name: "interviewHappened" });
  const status = useWatch({ control, name: "status" });

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
              value={field.value ?? ""}
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
        // TODO: handle autocompletion with fetching existing companies from the db
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
      <Controller
        name="contract"
        control={control}
        render={({ field, fieldState }) => (
          <FieldSet data-invalid={fieldState.invalid} className="max-w-fit">
            <FieldLegend variant="label">
              {t("jobs.create.form.labels.contract")}
            </FieldLegend>

            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
              className="flex flex-row flex-wrap justify-center gap-4 md:justify-start"
            >
              {jobContractEnum.enumValues.map((c) => (
                <DetailTile
                  key={c}
                  checked={c === field.value}
                  onCheckedChange={(_checked) => field.onChange(c)}
                  id={`${field.name}_${c}`}
                  aria-invalid={fieldState.invalid}
                  label={t(CONTRACT_LABELS_ICONS[c].label)}
                  icon={CONTRACT_LABELS_ICONS[c].icon}
                />
              ))}
            </RadioGroup>
            {fieldState.invalid && (
              <TranslatedFieldError error={fieldState.error} />
            )}
          </FieldSet>
        )}
      />
      <Controller
        name="level"
        control={control}
        render={({ field, fieldState }) => (
          <FieldSet data-invalid={fieldState.invalid} className="max-w-fit">
            <FieldLegend variant="label">
              {t("jobs.create.form.labels.level")}
            </FieldLegend>

            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
              className="flex flex-row flex-wrap justify-center gap-4 md:justify-start"
            >
              {jobLevelEnum.enumValues.map((l) => (
                <DetailTile
                  key={l}
                  checked={l === field.value}
                  onCheckedChange={(_checked) => field.onChange(l)}
                  id={`${field.name}_${l}`}
                  aria-invalid={fieldState.invalid}
                  label={t(LEVEL_LABELS_ICONS[l].label)}
                  icon={LEVEL_LABELS_ICONS[l].icon}
                />
              ))}
            </RadioGroup>
            {fieldState.invalid && (
              <TranslatedFieldError error={fieldState.error} />
            )}
          </FieldSet>
        )}
      />

      <Section
        heading={t("jobs.create.form.labels.salary.heading")}
        rightArrow
        clickable
        contentClassName="flex-col md:flex-row gap-4"
      >
        <Controller
          name="salary.value"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="max-w-fit">
              <FieldLabel htmlFor={field.name}>
                {t("jobs.create.form.labels.salary.value.label")}
              </FieldLabel>

              <Input
                {...field}
                onChange={(e) => {
                  const v = e.target.valueAsNumber;
                  field.onChange(Number.isNaN(v) ? null : v);
                }}
                value={field.value ?? ""}
                id={field.name}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
                type="number"
                step={500}
              />

              {fieldState.invalid && (
                <TranslatedFieldError error={fieldState.error} />
              )}
            </Field>
          )}
        />
        {/* TODO: use combobox here */}
        <Controller
          name="salary.currency.currency"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="max-w-fit">
              <FieldLabel htmlFor={field.name}>
                {t("jobs.create.form.labels.salary.currency.label")}
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <TranslatedFieldError error={fieldState.error} />
              )}
            </Field>
          )}
        />
      </Section>

      <Controller
        name="workMode"
        control={control}
        render={({ field, fieldState }) => (
          <FieldSet data-invalid={fieldState.invalid} className="max-w-fit">
            <FieldLegend variant="label">
              {t("jobs.create.form.labels.workMode")}
            </FieldLegend>

            <RadioGroup
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid}
              className="flex flex-row flex-wrap justify-center gap-4 md:justify-start"
            >
              {workModeEnum.enumValues.map((mode) => (
                <DetailTile
                  key={mode}
                  checked={mode === field.value}
                  onCheckedChange={(_checked) => field.onChange(mode)}
                  id={`${field.name}_${mode}`}
                  aria-invalid={fieldState.invalid}
                  label={t(WORK_MODE_LABELS_ICONS[mode].label)}
                  icon={WORK_MODE_LABELS_ICONS[mode].icon}
                />
              ))}
            </RadioGroup>
            {fieldState.invalid && (
              <TranslatedFieldError error={fieldState.error} />
            )}
          </FieldSet>
        )}
      />

      {/* <Section
        heading={t("jobs.create.form.labels.skills.heading")}
        rightArrow
        clickable
        contentClassName="flex flex-row flex-wrap gap-1"
      >
        {}

// TODO: COMBOBOX LATER instead of input 
        <Controller
          name="skills"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="max-w-fit">
              <FieldLabel htmlFor={field.name}>
                {t("jobs.create.form.labels.skills.label")}
              </FieldLabel>

              <Input
                {...field}
                id={field.name}
                value={field.value ?? ""}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && (
                <TranslatedFieldError error={fieldState.error} />
              )}
            </Field>
          )}
        />
      </Section> */}

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
                  field.onChange(checked);
                  if (!checked) {
                    resetField("interviewHappened");
                    resetField("interviewCount");
                    resetField("status");
                    return;
                  }
                  setValue("status", "applied");
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
            <Controller
              name="interviewHappened"
              control={control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="max-w-fit flex-row items-center gap-4"
                >
                  <FieldLabel htmlFor="interviewHappened">
                    {t(
                      "jobs.create.form.labels.application.interview.happened"
                    )}
                  </FieldLabel>
                  <Switch
                    id="interviewHappened"
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      setValue("interviewCount", Number(checked), {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                      field.onChange(checked);
                    }}
                  />
                </Field>
              )}
            />

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
                        field.onChange(Number.isNaN(v) ? null : v);
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

            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <FieldSet
                  data-invalid={fieldState.invalid}
                  className="max-w-fit"
                >
                  <FieldLegend variant="label">
                    {t("jobs.create.form.labels.application.status")}
                  </FieldLegend>

                  <div
                    onBlur={field.onBlur}
                    aria-invalid={fieldState.invalid}
                    className="flex flex-row flex-wrap justify-center gap-4 md:justify-start"
                  >
                    {offerStatusEnum.enumValues
                      .filter((v) => isTerminalStatus(v))
                      .map((s) => (
                        <DetailTile
                          key={s}
                          checked={s === field.value}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange(s);
                            } else {
                              field.onChange("applied");
                            }
                          }}
                          id={`${field.name}_${s}`}
                          aria-invalid={fieldState.invalid}
                          label={t(STATUS_LABELS_ICONS[s].label)}
                          icon={STATUS_LABELS_ICONS[s].icon}
                        />
                      ))}
                  </div>
                </FieldSet>
              )}
            />
            {status !== "ghosted" && (
              <Controller
                name="feedback"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="feedback">
                      {t("jobs.create.form.labels.application.feedback")}
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="feedback"
                      value={field.value ?? ""}
                      aria-invalid={fieldState.invalid}
                      className="resize-y"
                    />
                    {fieldState.invalid && (
                      <TranslatedFieldError error={fieldState.error} />
                    )}
                  </Field>
                )}
              />
            )}
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
      <Controller
        name="expirationDate"
        control={control}
        render={({ field }) => (
          <Field className="w-fit">
            <FieldLabel htmlFor="date-picker-simple">
              {t("jobs.create.form.labels.expirationDate.label")}
            </FieldLabel>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="outline"
                    id="date-picker-simple"
                    className="justify-start font-normal"
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>
                        {t(
                          "jobs.create.form.labels.expirationDate.placeholder"
                        )}
                      </span>
                    )}
                  </Button>
                }
              />
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  // TODO: accept only future dates here, and on the backend (schema)
                  mode="single"
                  selected={field.value ?? undefined}
                  onSelect={field.onChange}
                  defaultMonth={field.value ?? undefined}
                />
              </PopoverContent>
            </Popover>
          </Field>
        )}
      />
      <div className="flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          size="lg"
          className="w-fit"
        >
          <PlusIcon weight="bold" />
          {t("jobs.create.form.labels.submit")}
        </Button>

        <Controller
          name="isFavorite"
          control={control}
          render={({ field, fieldState }) => (
            <Button
              size="icon-lg"
              variant="outline_fat"
              chocolate="enabled"
              onClick={() => field.onChange(!field.value)}
              disabled={fieldState.isValidating}
            >
              <StarIcon
                weight={field.value ? "fill" : "bold"}
                className={cn(field.value && "text-brand-secondary")}
              />
            </Button>
          )}
        />
      </div>
    </form>
  );
};
