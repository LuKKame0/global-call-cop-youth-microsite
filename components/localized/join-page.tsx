"use client";

import countries from "world-countries";
import { useMemo, useState } from "react";

import { FloatingInput } from "@/components/floating-input";
import { useCurrentLocale, useDictionary } from "@/lib/i18n/context";

const countryOptions = countries
  .map((country) => country.name.common)
  .sort((a, b) => a.localeCompare(b));

type Tab = "general" | "focalPoint";

export function JoinPageContent() {
  const dictionary = useDictionary();
  const locale = useCurrentLocale();
  const copy = dictionary.join;
  const common = dictionary.common;

  const [tab, setTab] = useState<Tab>("general");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const [generalForm, setGeneralForm] = useState({
    name: "",
    email: "",
    organization: "",
    role: "",
    country: "",
    intent: "",
  });

  const [focalForm, setFocalForm] = useState({
    firstName: "",
    lastName: "",
    linkedin: "",
    age: "",
    country: "",
    city: "",
    hostZCop: "maybe" as "yes" | "no" | "maybe",
  });

  const countrySelect = useMemo(
    () => (
      <label className="block space-y-2">
        <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
          {tab === "general" ? copy.general.country : copy.focalPoint.country}
        </span>
        <select
          required
          value={tab === "general" ? generalForm.country : focalForm.country}
          onChange={(event) => {
            const value = event.target.value;
            if (tab === "general") {
              setGeneralForm((current) => ({ ...current, country: value }));
            } else {
              setFocalForm((current) => ({ ...current, country: value }));
            }
          }}
          className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-button-secondary-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none"
        >
          <option value="">{common.required}</option>
          {countryOptions.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </label>
    ),
    [common.required, copy.focalPoint.country, copy.general.country, focalForm.country, generalForm.country, tab],
  );

  async function submitGeneral(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(generalForm),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  async function submitFocalPoint(event: React.FormEvent) {
    event.preventDefault();
    setStatus("loading");
    try {
      const response = await fetch("/api/focal-point", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...focalForm,
          age: Number(focalForm.age),
          locale,
        }),
      });
      setStatus(response.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-8 sm:px-5 lg:py-12">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-faint)]">
          {dictionary.nav.join}
        </p>
        <h1 className="font-display text-5xl uppercase tracking-[0.04em] text-[var(--text-primary)] sm:text-6xl">
          {copy.title}
        </h1>
        <p className="max-w-3xl text-base leading-8 text-[var(--text-muted)]">{copy.subtitle}</p>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {(["general", "focalPoint"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => {
              setTab(key);
              setStatus("idle");
            }}
            className={[
              "rounded-full border px-4 py-2 text-sm transition",
              tab === key
                ? "border-[rgba(55,171,250,0.36)] bg-[var(--glass-button-secondary-bg)] text-[var(--text-primary)]"
                : "border-[var(--glass-border)] text-[var(--text-muted)]",
            ].join(" ")}
          >
            {copy.tabs[key]}
          </button>
        ))}
      </div>

      <div className="glass-panel-strong mt-6 p-6 sm:p-8">
        {status === "success" ? (
          <p className="text-base leading-8 text-[var(--brand-green)]">{copy.success}</p>
        ) : null}

        {status === "error" ? (
          <p className="mb-4 text-base leading-8 text-[var(--brand-pink)]">{copy.error}</p>
        ) : null}

        {tab === "general" && status !== "success" ? (
          <form onSubmit={submitGeneral} className="space-y-5">
            <div>
              <h2 className="font-display text-3xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                {copy.general.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                {copy.general.description}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingInput
                id="join-name"
                label={copy.general.name}
                required
                value={generalForm.name}
                onChange={(event) =>
                  setGeneralForm((current) => ({ ...current, name: event.target.value }))
                }
              />
              <FloatingInput
                id="join-email"
                label={copy.general.email}
                type="email"
                required
                value={generalForm.email}
                onChange={(event) =>
                  setGeneralForm((current) => ({ ...current, email: event.target.value }))
                }
              />
              <FloatingInput
                id="join-org"
                label={copy.general.organization}
                required
                value={generalForm.organization}
                onChange={(event) =>
                  setGeneralForm((current) => ({ ...current, organization: event.target.value }))
                }
              />
              <FloatingInput
                id="join-role"
                label={copy.general.role}
                required
                value={generalForm.role}
                onChange={(event) =>
                  setGeneralForm((current) => ({ ...current, role: event.target.value }))
                }
              />
            </div>
            {countrySelect}
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
                {copy.general.intent}
              </span>
              <textarea
                id="join-intent"
                required
                rows={4}
                placeholder={copy.general.intentPlaceholder}
                value={generalForm.intent}
                onChange={(event) =>
                  setGeneralForm((current) => ({ ...current, intent: event.target.value }))
                }
                className="w-full rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-button-secondary-bg)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none"
              />
            </label>
            <button type="submit" className="glass-button-primary" disabled={status === "loading"}>
              {status === "loading" ? common.submitting : common.submit}
            </button>
          </form>
        ) : null}

        {tab === "focalPoint" && status !== "success" ? (
          <form onSubmit={submitFocalPoint} className="space-y-5">
            <div>
              <h2 className="font-display text-3xl uppercase tracking-[0.04em] text-[var(--text-primary)]">
                {copy.focalPoint.title}
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                {copy.focalPoint.description}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingInput
                id="fp-first-name"
                label={copy.focalPoint.firstName}
                required
                value={focalForm.firstName}
                onChange={(event) =>
                  setFocalForm((current) => ({ ...current, firstName: event.target.value }))
                }
              />
              <FloatingInput
                id="fp-last-name"
                label={copy.focalPoint.lastName}
                required
                value={focalForm.lastName}
                onChange={(event) =>
                  setFocalForm((current) => ({ ...current, lastName: event.target.value }))
                }
              />
              <FloatingInput
                id="fp-linkedin"
                label={copy.focalPoint.linkedin}
                required
                value={focalForm.linkedin}
                onChange={(event) =>
                  setFocalForm((current) => ({ ...current, linkedin: event.target.value }))
                }
              />
              <FloatingInput
                id="fp-age"
                label={copy.focalPoint.age}
                type="number"
                min={16}
                max={120}
                required
                value={focalForm.age}
                onChange={(event) =>
                  setFocalForm((current) => ({ ...current, age: event.target.value }))
                }
              />
              <FloatingInput
                id="fp-city"
                label={copy.focalPoint.city}
                required
                value={focalForm.city}
                onChange={(event) =>
                  setFocalForm((current) => ({ ...current, city: event.target.value }))
                }
              />
            </div>
            {countrySelect}
            <fieldset className="space-y-3">
              <legend className="text-xs uppercase tracking-[0.18em] text-[var(--text-faint)]">
                {copy.focalPoint.hostZCop}
              </legend>
              <p className="text-sm leading-7 text-[var(--text-muted)]">
                {copy.focalPoint.hostZCopHelp}
              </p>
              <div className="flex flex-wrap gap-3">
                {(["yes", "no", "maybe"] as const).map((value) => (
                  <label key={value} className="glass-chip flex items-center gap-2 px-4 py-2 text-sm">
                    <input
                      type="radio"
                      name="hostZCop"
                      value={value}
                      checked={focalForm.hostZCop === value}
                      onChange={() => setFocalForm((current) => ({ ...current, hostZCop: value }))}
                    />
                    {common[value]}
                  </label>
                ))}
              </div>
            </fieldset>
            <button type="submit" className="glass-button-primary" disabled={status === "loading"}>
              {status === "loading" ? common.submitting : common.submit}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
