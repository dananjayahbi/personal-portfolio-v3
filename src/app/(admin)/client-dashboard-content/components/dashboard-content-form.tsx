'use client';

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { saveDashboardContent, type ContentState } from "../actions";

const initialContentState: ContentState = { status: 'idle' };

export type DashboardContentDefaults = {
  heroEyebrow?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  highlights?: string[];
  primaryCtaLabel?: string;
  primaryCtaUrl?: string;
  secondaryCtaLabel?: string | null;
  secondaryCtaUrl?: string | null;
  aboutTitle?: string;
  aboutSummary?: string;
  aboutNarrative?: string | null;
  skills?: string[];
};

function Fieldset({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
      <legend className="text-lg font-semibold text-white">{title}</legend>
      {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {children}
      </div>
    </fieldset>
  );
}

function TextField({
  label,
  name,
  defaultValue,
  error,
  placeholder,
  type = 'text',
  rows,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  rows?: number;
}) {
  const shared = {
    name,
    defaultValue,
    placeholder,
  };

  const baseClasses = clsx(
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20',
    error && '!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40'
  );

  return (
    <label className="flex flex-col gap-2 text-sm text-white/70 md:col-span-1">
      <span className="font-medium text-white">{label}</span>
      {rows ? (
        <textarea {...shared} rows={rows} className={baseClasses} />
      ) : (
        <input {...shared} type={type} className={baseClasses} />
      )}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SubmitBar({ success }: { success?: string }) {
  const { pending } = useFormStatus();
  return (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 md:px-6">
      <div className="text-sm text-white/70">
        {pending ? 'Saving your narrative…' : success ?? 'Every update reflects instantly on the live site.'}
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
      >
        {pending ? 'Saving…' : 'Save changes'}
      </button>
    </div>
  );
}

export function DashboardContentForm({ defaults }: { defaults: DashboardContentDefaults }) {
  const [state, formAction] = useActionState(saveDashboardContent, initialContentState);
  const [success, setSuccess] = useState<string | undefined>();

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      setSuccess(state.message);
      const timeout = setTimeout(() => setSuccess(undefined), 4000);
      return () => clearTimeout(timeout);
    }
    if (state.status === 'error' && state.message) {
      setSuccess(undefined);
    }
  }, [state]);

  const skillText = defaults.skills?.join('\n') ?? '';
  const highlights = defaults.highlights ?? [];

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <Fieldset
        title="Hero Narrative"
        description="Craft the first impression above the fold—be bold, personal, and unmistakably you."
      >
        <TextField
          label="Eyebrow"
          name="heroEyebrow"
          defaultValue={defaults.heroEyebrow}
          error={state.fieldErrors?.heroEyebrow}
          placeholder="Award-winning product designer"
        />
        <TextField
          label="Headline"
          name="heroHeadline"
          defaultValue={defaults.heroHeadline}
          error={state.fieldErrors?.heroHeadline}
          placeholder="Designing immersive experiences for visionary brands"
        />
        <TextField
          label="Subheadline"
          name="heroSubheadline"
          defaultValue={defaults.heroSubheadline}
          error={state.fieldErrors?.heroSubheadline}
          placeholder="I partner with founders and product leaders to craft delightful, scalable digital experiences."
          rows={4}
        />
        <TextField
          label="Highlight 1"
          name="highlightOne"
          defaultValue={highlights[0]}
          error={state.fieldErrors?.highlightOne}
          placeholder="Led experience design for 12+ venture-backed startups"
        />
        <TextField
          label="Highlight 2"
          name="highlightTwo"
          defaultValue={highlights[1]}
          error={state.fieldErrors?.highlightTwo}
          placeholder="Unlocking 30% conversion lifts through storytelling"
        />
        <TextField
          label="Highlight 3"
          name="highlightThree"
          defaultValue={highlights[2]}
          error={state.fieldErrors?.highlightThree}
          placeholder="Speaking at global design conferences"
        />
        <TextField
          label="Primary CTA label"
          name="primaryCtaLabel"
          defaultValue={defaults.primaryCtaLabel}
          error={state.fieldErrors?.primaryCtaLabel}
          placeholder="Book a collaboration call"
        />
        <TextField
          label="Primary CTA URL"
          name="primaryCtaUrl"
          defaultValue={defaults.primaryCtaUrl}
          error={state.fieldErrors?.primaryCtaUrl}
          placeholder="https://cal.com/yourname"
          type="url"
        />
        <TextField
          label="Secondary CTA label"
          name="secondaryCtaLabel"
          defaultValue={defaults.secondaryCtaLabel ?? undefined}
          error={state.fieldErrors?.secondaryCtaLabel}
          placeholder="Download portfolio deck"
        />
        <TextField
          label="Secondary CTA URL"
          name="secondaryCtaUrl"
          defaultValue={defaults.secondaryCtaUrl ?? undefined}
          error={state.fieldErrors?.secondaryCtaUrl}
          placeholder="https://notion.so/portfolio"
          type="url"
        />
      </Fieldset>

      <Fieldset
        title="About & Narrative"
        description="Share the story behind the craft—your philosophy, process, and differentiators."
      >
        <TextField
          label="About title"
          name="aboutTitle"
          defaultValue={defaults.aboutTitle}
          error={state.fieldErrors?.aboutTitle}
          placeholder="Designing soulful experiences for ambitious teams"
        />
        <TextField
          label="About summary"
          name="aboutSummary"
          defaultValue={defaults.aboutSummary}
          error={state.fieldErrors?.aboutSummary}
          placeholder="Multidisciplinary designer weaving storytelling with systems thinking."
          rows={4}
        />
        <TextField
          label="Extended narrative"
          name="aboutNarrative"
          defaultValue={defaults.aboutNarrative ?? undefined}
          error={state.fieldErrors?.aboutNarrative}
          placeholder="Use this space to elaborate on your process, beliefs, and past achievements."
          rows={6}
        />
        <TextField
          label="Skills & focus areas"
          name="skills"
          defaultValue={skillText}
          error={state.fieldErrors?.skills}
          placeholder="Product strategy\nDesign systems\nMotion design"
          rows={6}
        />
      </Fieldset>

      {state.status === 'error' && state.message && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-6 py-4 text-sm text-red-200">
          {state.message}
        </div>
      )}

      <SubmitBar success={success} />
    </form>
  );
}
