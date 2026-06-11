"use client";

import { STEP_DEFINITIONS, THEME_DEFINITIONS } from "@/lib/content";
import { useDictionary } from "@/lib/i18n/context";
import type { StepDefinition, ThemeDefinition } from "@/types/submission";

export function useLocalizedSubmissionContent() {
  const { insights } = useDictionary();

  const stepDefinitions: StepDefinition[] = STEP_DEFINITIONS.map((step, index) => {
    const copy = insights.steps[index];
    return {
      ...step,
      label: copy?.label ?? step.label,
      eyebrow: copy?.eyebrow ?? step.eyebrow,
      description: copy?.description ?? step.description,
    };
  });

  const themeDefinitions: ThemeDefinition[] = THEME_DEFINITIONS.map((theme, index) => {
    const copy = insights.themes[index];
    if (!copy) return theme;
    return {
      ...theme,
      shortLabel: copy.shortLabel,
      title: copy.title,
      tagline: copy.tagline,
      scale: copy.scale,
      actionHint: copy.actionHint,
      fullLabel: `${copy.shortLabel} - ${copy.title}`,
      fields: theme.fields.map((field, fieldIndex) => {
        const fieldCopy = copy.fields[fieldIndex];
        return fieldCopy
          ? {
              ...field,
              label: fieldCopy.label,
              placeholder: fieldCopy.placeholder,
              helper: fieldCopy.helper,
            }
          : field;
      }),
    };
  });

  return { stepDefinitions, themeDefinitions, copy: insights };
}
