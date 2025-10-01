'use client';

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { saveSiteSettings, type SettingsState } from "../actions";
import { CloudinaryImageInput } from "@/components/common/cloudinary-image-input";

const initialSettingsState: SettingsState = { status: 'idle' };

type SettingsDefaults = {
  contactEmail?: string;
  contactPhone?: string | null;
  location?: string | null;
  availability?: string | null;
  resumeUrl?: string | null;
  socialLinks?: Array<{ platform: string; url: string }>;
  seo?: {
    title?: string | null;
    description?: string | null;
    keywords?: string[];
    image?: string | null;
  } | null;
  theme?: {
    accent?: string | null;
    mode?: string | null;
  } | null;
  footerNote?: string | null;
};

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
      <header>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2">{children}</div>
    </section>
  );
}

function TextInput({
  label,
  name,
  defaultValue,
  error,
  placeholder,
  rows,
  type = 'text',
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  error?: string;
  placeholder?: string;
  rows?: number;
  type?: string;
}) {
  const inputClass = clsx(
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20',
    error && '!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40'
  );

  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      {rows ? (
        <textarea name={name} defaultValue={defaultValue ?? undefined} placeholder={placeholder} rows={rows} className={inputClass} />
      ) : (
        <input name={name} defaultValue={defaultValue ?? undefined} placeholder={placeholder} className={inputClass} type={type} />
      )}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SelectInput({
  label,
  name,
  defaultValue,
  options,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: Array<{ label: string; value: string }>;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue ?? undefined}
        className={clsx(
          'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20',
          error && '!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-slate-900">
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SubmitBar({ success }: { success?: string }) {
  const { pending } = useFormStatus();
  return (
  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 md:px-6">
      <div className="text-sm text-white/70">
        {pending ? 'Saving configuration…' : success ?? 'Updates ship immediately to the live experience.'}
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
      >
        {pending ? 'Saving…' : 'Save settings'}
      </button>
    </div>
  );
}

export function SiteSettingsForm({ defaults }: { defaults: SettingsDefaults }) {
  const [state, formAction] = useActionState(saveSiteSettings, initialSettingsState);
  const [success, setSuccess] = useState<string | undefined>();

  useEffect(() => {
    if (state.status === 'success' && state.message) {
      setSuccess(state.message);
      const timeout = setTimeout(() => setSuccess(undefined), 4000);
      return () => clearTimeout(timeout);
    }
    if (state.status === 'error') {
      setSuccess(undefined);
    }
  }, [state]);

  const socialDefault = defaults.socialLinks
    ?.map((link) => `${link.platform} | ${link.url}`)
    .join('\n');
  const keywordsDefault = defaults.seo?.keywords?.join(', ');

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <Section title="Contact & availability" description="Keep inquiries flowing with current and clear contact details.">
        <TextInput
          label="Primary email"
          name="contactEmail"
          defaultValue={defaults.contactEmail}
          error={state.fieldErrors?.contactEmail}
          placeholder="hello@studio.com"
        />
        <TextInput
          label="Phone or WhatsApp"
          name="contactPhone"
          defaultValue={defaults.contactPhone}
          error={state.fieldErrors?.contactPhone}
          placeholder="+1 415 555 0198"
        />
        <TextInput
          label="Location"
          name="location"
          defaultValue={defaults.location}
          error={state.fieldErrors?.location}
          placeholder="San Francisco ↔ Remote"
        />
        <TextInput
          label="Availability note"
          name="availability"
          defaultValue={defaults.availability}
          error={state.fieldErrors?.availability}
          placeholder="Currently booking Q4 collaborations"
        />
        <TextInput
          label="Public resume / media kit"
          name="resumeUrl"
          defaultValue={defaults.resumeUrl}
          error={state.fieldErrors?.resumeUrl}
          placeholder="https://notion.so/your-resume"
        />
        <TextInput
          label="Footer message"
          name="footerNote"
          defaultValue={defaults.footerNote}
          error={state.fieldErrors?.footerNote}
          placeholder="Available for select partnerships in 2025"
          rows={3}
        />
      </Section>

      <Section
        title="Social presence"
        description="Map each platform to a URL. One per line using the format Platform | https://link."
      >
        <TextInput
          label="Social links"
          name="socialLinks"
          defaultValue={socialDefault}
          error={state.fieldErrors?.socialLinks}
          placeholder={"LinkedIn | https://linkedin.com/in/you\nDribbble | https://dribbble.com/you"}
          rows={6}
        />
      </Section>

      <Section title="SEO & sharing" description="Define how search engines and social previews introduce your brand.">
        <TextInput
          label="SEO title"
          name="seoTitle"
          defaultValue={defaults.seo?.title ?? undefined}
          error={state.fieldErrors?.seoTitle}
          placeholder="Product designer partnering with visionary teams"
        />
        <TextInput
          label="SEO description"
          name="seoDescription"
          defaultValue={defaults.seo?.description ?? undefined}
          error={state.fieldErrors?.seoDescription}
          rows={4}
          placeholder="Crafting immersive digital experiences with measurable impact."
        />
        <TextInput
          label="SEO keywords"
          name="seoKeywords"
          defaultValue={keywordsDefault}
          error={state.fieldErrors?.seoKeywords}
          placeholder="product design, design systems, storytelling"
        />
        <CloudinaryImageInput
          label="Open Graph image"
          name="ogImage"
          defaultValue={defaults.seo?.image ?? undefined}
          error={state.fieldErrors?.ogImage}
          hint="Upload a social sharing preview at 1200×630."
          folder="portfolio/meta"
        />
      </Section>

      <Section title="Theme" description="Fine-tune the aesthetic language of the public site.">
        <TextInput
          label="Accent color keyword"
          name="themeAccent"
          defaultValue={defaults.theme?.accent ?? 'violet'}
          error={state.fieldErrors?.themeAccent}
          placeholder="violet"
        />
        <SelectInput
          label="Default mode"
          name="themeMode"
          defaultValue={defaults.theme?.mode ?? 'auto'}
          options={[
            { label: 'Follow system', value: 'auto' },
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]}
          error={state.fieldErrors?.themeMode}
        />
      </Section>

      {state.status === 'error' && state.message && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-6 py-4 text-sm text-red-200">
          {state.message}
        </div>
      )}

      <SubmitBar success={success} />
    </form>
  );
}
