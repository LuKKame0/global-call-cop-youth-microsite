"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useForm, useWatch, type FieldPath } from "react-hook-form";

import { FloatingInput } from "@/components/floating-input";
import { TextareaField } from "@/components/textarea-field";
import { DEFAULT_FORM_VALUES, FORM_DRAFT_KEY, THEME_DEFINITIONS } from "@/lib/content";
import { useLocalizedSubmissionContent } from "@/lib/i18n/localized-submission";
import { submissionPayloadSchema } from "@/lib/schema";
import type {
  SubmissionPayload,
  SubmissionResponse,
  ThemeKey,
} from "@/types/submission";

const BASIC_INFO_FIELDS: FieldPath<SubmissionPayload>[] = [
  "country",
  "youth_structure",
  "name",
  "email",
];

const STEP_FIELDS: Array<FieldPath<SubmissionPayload>[]> = [
  BASIC_INFO_FIELDS,
  [
    "themes.self.personal_barriers",
    "themes.self.leadership_identity",
    "themes.self.challenges_resilience",
  ],
  [
    "themes.community.team_mobilising",
    "themes.community.local_codesign",
    "themes.community.knowledge_sharing",
  ],
  [
    "themes.institutions.education_local_government",
    "themes.institutions.sector_engagement",
    "themes.institutions.global_branch",
  ],
  [
    "themes.systems.policy_transformation",
    "themes.systems.cultural_narratives",
    "themes.systems.digital_infrastructure",
  ],
  [],
];

function hasAnyFormContent(values: SubmissionPayload | undefined) {
  if (!values) {
    return false;
  }

  return Boolean(
    values.country ||
      values.youth_structure ||
      values.name ||
      values.email ||
      Object.values(values.themes.self).some(Boolean) ||
      Object.values(values.themes.community).some(Boolean) ||
      Object.values(values.themes.institutions).some(Boolean) ||
      Object.values(values.themes.systems).some(Boolean),
  );
}

function mergeDraftWithDefaults(
  draft: Partial<SubmissionPayload> | undefined,
): SubmissionPayload {
  return {
    country: draft?.country ?? DEFAULT_FORM_VALUES.country,
    youth_structure:
      draft?.youth_structure ?? DEFAULT_FORM_VALUES.youth_structure,
    name: draft?.name ?? DEFAULT_FORM_VALUES.name,
    email: draft?.email ?? DEFAULT_FORM_VALUES.email,
    themes: {
      self: {
        personal_barriers:
          draft?.themes?.self?.personal_barriers ??
          DEFAULT_FORM_VALUES.themes.self.personal_barriers,
        leadership_identity:
          draft?.themes?.self?.leadership_identity ??
          DEFAULT_FORM_VALUES.themes.self.leadership_identity,
        challenges_resilience:
          draft?.themes?.self?.challenges_resilience ??
          DEFAULT_FORM_VALUES.themes.self.challenges_resilience,
      },
      community: {
        team_mobilising:
          draft?.themes?.community?.team_mobilising ??
          DEFAULT_FORM_VALUES.themes.community.team_mobilising,
        local_codesign:
          draft?.themes?.community?.local_codesign ??
          DEFAULT_FORM_VALUES.themes.community.local_codesign,
        knowledge_sharing:
          draft?.themes?.community?.knowledge_sharing ??
          DEFAULT_FORM_VALUES.themes.community.knowledge_sharing,
      },
      institutions: {
        education_local_government:
          draft?.themes?.institutions?.education_local_government ??
          DEFAULT_FORM_VALUES.themes.institutions.education_local_government,
        sector_engagement:
          draft?.themes?.institutions?.sector_engagement ??
          DEFAULT_FORM_VALUES.themes.institutions.sector_engagement,
        global_branch:
          draft?.themes?.institutions?.global_branch ??
          DEFAULT_FORM_VALUES.themes.institutions.global_branch,
      },
      systems: {
        policy_transformation:
          draft?.themes?.systems?.policy_transformation ??
          DEFAULT_FORM_VALUES.themes.systems.policy_transformation,
        cultural_narratives:
          draft?.themes?.systems?.cultural_narratives ??
          DEFAULT_FORM_VALUES.themes.systems.cultural_narratives,
        digital_infrastructure:
          draft?.themes?.systems?.digital_infrastructure ??
          DEFAULT_FORM_VALUES.themes.systems.digital_infrastructure,
      },
    },
  };
}

function formatDraftMessage(savedAt: string) {
  return `Draft saved ${new Date(savedAt).toLocaleString()}.`;
}

export function SubmissionWizard() {
  const reduceMotion = useReducedMotion();
  const { stepDefinitions, themeDefinitions } = useLocalizedSubmissionContent();
  const [currentStep, setCurrentStep] = useState(0);
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);
  const [draftMessage, setDraftMessage] = useState(
    "Draft autosaves locally on this device.",
  );
  const [submissionState, setSubmissionState] = useState<{
    type: "idle" | "success" | "error";
    message?: string;
    submissionId?: string;
    warning?: string;
  }>({ type: "idle" });
  const [isStepPending, startStepTransition] = useTransition();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const draftReadyRef = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionPayload>({
    resolver: zodResolver(submissionPayloadSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onBlur",
  });

  const watchedValues = useWatch({ control });
  const deferredValues = useDeferredValue(watchedValues);

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(FORM_DRAFT_KEY);

      if (!rawDraft) {
        draftReadyRef.current = true;
        return;
      }

      const parsedDraft = JSON.parse(rawDraft) as {
        values?: Partial<SubmissionPayload>;
        savedAt?: string;
      } & Partial<SubmissionPayload>;

      const restoredValues =
        "values" in parsedDraft && parsedDraft.values
          ? parsedDraft.values
          : parsedDraft;

      reset(mergeDraftWithDefaults(restoredValues));
      window.requestAnimationFrame(() => {
        setDraftMessage(
          parsedDraft.savedAt
            ? `Draft restored from ${new Date(parsedDraft.savedAt).toLocaleString()}.`
            : "Draft restored from this device.",
        );
      });
    } catch {
      window.requestAnimationFrame(() => {
        setDraftMessage(
          "A previous draft could not be restored, so a fresh submission has been loaded.",
        );
      });
    } finally {
      draftReadyRef.current = true;
    }
  }, [reset]);

  useEffect(() => {
    if (!draftReadyRef.current || !deferredValues) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (!hasAnyFormContent(deferredValues as SubmissionPayload)) {
        window.localStorage.removeItem(FORM_DRAFT_KEY);
        return;
      }

      const payload = {
        values: deferredValues,
        savedAt: new Date().toISOString(),
      };

      window.localStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(payload));
      setDraftMessage(formatDraftMessage(payload.savedAt));
    }, 650);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [deferredValues]);

  useEffect(() => {
    stepHeadingRef.current?.focus();
  }, [currentStep]);

  const currentTheme = currentStep > 0 && currentStep < 5
    ? themeDefinitions[currentStep - 1]
    : null;

  const progressValue = useMemo(() => {
    return Math.round(((currentStep + 1) / stepDefinitions.length) * 100);
  }, [currentStep, stepDefinitions.length]);

  async function handleNext() {
    const isValid = await trigger(STEP_FIELDS[currentStep], { shouldFocus: true });

    if (!isValid) {
      return;
    }

    const nextStep = Math.min(currentStep + 1, stepDefinitions.length - 1);

    startStepTransition(() => {
      setCurrentStep(nextStep);
      setMaxUnlockedStep((previous) => Math.max(previous, nextStep));
    });
  }

  function handleBack() {
    const previousStep = Math.max(currentStep - 1, 0);
    startStepTransition(() => setCurrentStep(previousStep));
  }

  async function handleStepSelection(stepIndex: number) {
    if (stepIndex === currentStep || stepIndex > maxUnlockedStep) {
      return;
    }

    startStepTransition(() => setCurrentStep(stepIndex));
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmissionState({ type: "idle" });

    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const body = (await response.json()) as SubmissionResponse;

    if (!response.ok || !body.ok) {
      setSubmissionState({
        type: "error",
        message:
          body.error ??
          "The submission could not be sent. Your draft is still stored locally on this device.",
      });
      return;
    }

    window.localStorage.removeItem(FORM_DRAFT_KEY);
    setSubmissionState({
      type: "success",
      message:
        "Your framework has been submitted to the COP implementation pipeline.",
      submissionId: body.submissionId,
      warning: body.warning,
    });
    setDraftMessage("Local draft cleared after successful submission.");
    reset(DEFAULT_FORM_VALUES);
    setMaxUnlockedStep(0);
    setCurrentStep(0);
  });

  return (
    <div className="glass-panel w-full max-w-full overflow-hidden">
      <div className="grid w-full lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-white/8 bg-black/12 p-3 sm:p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="space-y-4 lg:sticky lg:top-24">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
                Completion
              </p>
              <div className="mt-3 h-2 rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--theme-self),var(--theme-community),var(--theme-institutions),var(--theme-systems))] transition-all"
                  style={{ width: `${progressValue}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-white/58">{progressValue}% of the framework prepared</p>
            </div>

            <nav
              aria-label="Submission steps"
              className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:block lg:space-y-2 lg:overflow-visible lg:px-0 lg:pb-0"
            >
              {stepDefinitions.map((step, index) => {
                const isCurrent = currentStep === index;
                const isUnlocked = index <= maxUnlockedStep || index === currentStep;

                return (
                  <button
                    key={step.id}
                    type="button"
                    aria-current={isCurrent ? "step" : undefined}
                    onClick={() => handleStepSelection(index)}
                    disabled={!isUnlocked}
                    className={[
                      "flex w-[78vw] max-w-[280px] snap-start shrink-0 items-start gap-3 rounded-[1.25rem] border px-3 py-3 text-left transition sm:w-[260px] lg:w-full lg:max-w-none lg:gap-4 lg:px-4 lg:py-4",
                      isCurrent
                        ? "border-white/18 bg-white/[0.08] shadow-[0_18px_45px_rgba(0,0,0,0.18)]"
                        : "border-white/8 bg-transparent hover:border-white/14 hover:bg-white/[0.04]",
                      !isUnlocked ? "cursor-not-allowed opacity-45" : "",
                    ].join(" ")}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold lg:h-10 lg:w-10"
                      style={{
                        backgroundColor: isCurrent
                          ? currentStep > 0 && currentStep < 5
                            ? THEME_DEFINITIONS[currentStep - 1].accentToken
                            : "rgba(255,255,255,0.16)"
                          : "rgba(255,255,255,0.08)",
                        color: isCurrent ? "#0b1119" : "rgba(255,255,255,0.82)",
                      }}
                    >
                      {index + 1}
                    </span>
                    <span className="min-w-0 flex-1 space-y-1">
                      <span className="block text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] lg:text-[11px] lg:tracking-[0.22em]">
                        {step.eyebrow}
                      </span>
                      <span className="block text-sm font-semibold text-[var(--text-primary)]">
                        {step.label}
                      </span>
                      <span className="hidden text-sm leading-6 text-[var(--text-muted)] lg:block">
                        {step.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>

            <div
              aria-live="polite"
              className="rounded-[1.35rem] border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-7 text-white/58"
            >
              {draftMessage}
            </div>
          </div>
        </aside>

        <div className="min-w-0 p-4 sm:p-6 lg:p-8">
          <form onSubmit={onSubmit} noValidate className="w-full max-w-full space-y-6">
            <div className="flex flex-col gap-4 border-b border-white/8 pb-6">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0 space-y-3">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
                    Step {currentStep + 1} of {stepDefinitions.length}
                  </p>
                  <h3
                    ref={stepHeadingRef}
                    tabIndex={-1}
                    className="font-display text-3xl uppercase tracking-[0.03em] text-[var(--text-primary)] outline-none [overflow-wrap:anywhere] sm:text-5xl sm:tracking-[0.04em]"
                  >
                    {stepDefinitions[currentStep].label}
                  </h3>
                </div>
                {currentTheme ? (
                  <div
                    className="w-fit max-w-full rounded-full border border-[var(--glass-border)] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] [overflow-wrap:anywhere] sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.18em]"
                    style={{ backgroundColor: `${currentTheme.accentToken}1a` }}
                  >
                    {currentTheme.fullLabel}
                  </div>
                ) : null}
              </div>
              <p className="max-w-3xl text-sm leading-7 text-[var(--text-muted)] sm:text-base">
                {currentTheme
                  ? `${currentTheme.tagline} ${currentTheme.scale} ${currentTheme.actionHint}`
                  : stepDefinitions[currentStep].description}
              </p>
            </div>

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentStep}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                transition={{ duration: reduceMotion ? 0 : 0.28, ease: "easeOut" }}
                className="w-full min-w-0 space-y-5"
              >
                {currentStep === 0 ? (
                  <>
                    <div className="rounded-[1.75rem] border border-white/8 bg-black/12 p-4 text-sm leading-7 text-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-6">
                      Begin with the national frame. Use the country and youth
                      structure as they should appear in the implementation
                      register, and enter the email that should receive the
                      confirmation message after submission.
                    </div>
                    <div className="grid w-full min-w-0 gap-4 md:grid-cols-2">
                      <FloatingInput
                        id="country"
                        label="Country"
                        helper="Use the national context that this framework represents."
                        error={errors.country?.message}
                        fieldValue={watchedValues.country ?? ""}
                        accentColor="var(--brand-blue)"
                        autoComplete="country-name"
                        data-testid="country-input"
                        {...register("country")}
                      />
                      <FloatingInput
                        id="youth_structure"
                        label="Youth structure"
                        helper="Example: Sangguniang Kabataan, National Youth Council, municipal youth network."
                        error={errors.youth_structure?.message}
                        fieldValue={watchedValues.youth_structure ?? ""}
                        accentColor="var(--brand-green)"
                        data-testid="youth-structure-input"
                        {...register("youth_structure")}
                      />
                      <FloatingInput
                        id="name"
                        label="Your name"
                        helper="This person will be listed as the focal-point respondent."
                        error={errors.name?.message}
                        fieldValue={watchedValues.name ?? ""}
                        accentColor="var(--brand-orange)"
                        autoComplete="name"
                        {...register("name")}
                      />
                      <FloatingInput
                        id="email"
                        label="Contact email"
                        helper="Used for confirmation and operational follow-up only."
                        error={errors.email?.message}
                        fieldValue={watchedValues.email ?? ""}
                        accentColor="var(--brand-pink)"
                        autoComplete="email"
                        type="email"
                        {...register("email")}
                      />
                    </div>
                  </>
                ) : null}

                {currentTheme ? (
                  currentTheme.fields.map((field) => {
                    const value =
                      ((watchedValues?.themes?.[currentTheme.key] as Record<
                        string,
                        string
                      > | undefined)?.[field.key] ?? "");
                    const themeErrors = errors.themes?.[
                      currentTheme.key as ThemeKey
                    ] as Record<string, { message?: string }> | undefined;

                    return (
                      <TextareaField
                        key={field.key}
                        id={`${currentTheme.key}-${field.key}`}
                        label={field.label}
                        helper={field.helper}
                        placeholder={field.placeholder}
                        error={themeErrors?.[field.key]?.message}
                        valueLength={value.length}
                        fieldValue={value}
                        accentColor={currentTheme.accentToken}
                        data-testid={`${currentTheme.key}-${field.key}`}
                        {...register(
                          `themes.${currentTheme.key}.${field.key}` as FieldPath<SubmissionPayload>,
                        )}
                      />
                    );
                  })
                ) : null}

                {currentStep === stepDefinitions.length - 1 ? (
                  <div className="space-y-5">
                    <div className="rounded-[1.75rem] border border-white/8 bg-black/12 p-5 text-sm leading-7 text-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.18)] sm:p-6">
                      Review the full framework before submission. The send will
                      create a normalized JSON record, a Google Sheets row, and
                      twelve RAG chunks for the thematic responses.
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                          Respondent
                        </p>
                        <dl className="mt-4 space-y-3 text-sm leading-7 text-white/66">
                          <div>
                            <dt className="text-white/42">Country</dt>
                            <dd>{watchedValues.country || "-"}</dd>
                          </div>
                          <div>
                            <dt className="text-white/42">Youth structure</dt>
                            <dd>{watchedValues.youth_structure || "-"}</dd>
                          </div>
                          <div>
                            <dt className="text-white/42">Name</dt>
                            <dd>{watchedValues.name || "-"}</dd>
                          </div>
                          <div>
                            <dt className="text-white/42">Email</dt>
                            <dd>{watchedValues.email || "-"}</dd>
                          </div>
                        </dl>
                      </div>
                      <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.03] p-5">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                          Output package
                        </p>
                        <ul className="mt-4 space-y-3 text-sm leading-7 text-white/66">
                          <li>Validated submission payload</li>
                          <li>Flat Google Sheets row for the main register</li>
                          <li>12 RAG chunks, one for each narrative answer</li>
                          <li>Confirmation email plus server-side backup snapshot</li>
                        </ul>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      {themeDefinitions.map((theme) => {
                        const responses = watchedValues.themes?.[
                          theme.key
                        ] as Record<string, string>;

                        return (
                          <article
                            key={theme.key}
                            className="rounded-[1.6rem] border border-white/8 bg-white/[0.03] p-5"
                          >
                            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                              <div className="min-w-0">
                                <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
                                  Theme {theme.number}
                                </p>
                                <h4
                                  className="font-display text-2xl uppercase tracking-[0.03em] [overflow-wrap:anywhere] sm:text-3xl sm:tracking-[0.04em]"
                                  style={{ color: theme.accentToken }}
                                >
                                  {theme.fullLabel}
                                </h4>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleStepSelection(theme.number)}
                                className="self-start rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white/56 transition hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.07] hover:text-white/76 sm:self-auto"
                              >
                                Review step
                              </button>
                            </div>
                            <div className="grid gap-3">
                              {theme.fields.map((field) => (
                                <div
                                  key={`${theme.key}-${field.key}`}
                                  className="rounded-[1.15rem] border border-white/8 bg-black/10 p-4"
                                >
                                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/38">
                                    {field.label}
                                  </p>
                                  <p className="mt-2 text-sm leading-7 text-white/64">
                                    {responses?.[field.key] || "-"}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                ) : null}
              </motion.div>
            </AnimatePresence>

            {submissionState.type !== "idle" ? (
              <div
                aria-live="polite"
                className={[
                  "rounded-[1.5rem] border px-5 py-4 text-sm leading-7",
                  submissionState.type === "success"
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                    : "border-rose-400/30 bg-rose-400/10 text-rose-100",
                ].join(" ")}
              >
                <p>{submissionState.message}</p>
                {submissionState.submissionId ? (
                  <p className="mt-1 text-emerald-200/86">
                    Submission ID: {submissionState.submissionId}
                  </p>
                ) : null}
                {submissionState.warning ? (
                  <p className="mt-1 text-amber-100/90">
                    Warning: {submissionState.warning}
                  </p>
                ) : null}
              </div>
            ) : null}

            <div className="flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="hidden text-sm leading-7 text-white/54 sm:block">
                Keyboard tip: use Tab to move, Shift+Tab to revisit, and
                regular Enter inside textareas will stay in the field instead of
                moving the wizard.
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
                {currentStep < stepDefinitions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isStepPending || isSubmitting}
                    className="order-1 w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 shadow-[0_18px_44px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_54px_rgba(255,255,255,0.16)] disabled:cursor-not-allowed disabled:opacity-60 sm:order-2 sm:w-auto"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="order-1 w-full rounded-2xl bg-[linear-gradient(120deg,var(--brand-blue),var(--brand-orange))] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(55,171,250,0.2)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(55,171,250,0.28)] disabled:cursor-not-allowed disabled:opacity-60 sm:order-2 sm:w-auto"
                  >
                    {isSubmitting ? "Submitting..." : "Submit framework"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0 || isSubmitting}
                  className="order-2 w-full rounded-2xl border border-white/12 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.12)] transition hover:-translate-y-0.5 hover:border-white/18 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-40 sm:order-1 sm:w-auto"
                >
                  Back
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
