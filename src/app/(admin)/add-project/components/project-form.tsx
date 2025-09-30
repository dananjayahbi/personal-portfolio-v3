'use client';

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { createProject, initialProjectState } from "../actions";
import { CloudinaryImageInput } from "@/components/common/cloudinary-image-input";

function FieldGroup({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-6">
      <header>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        {description && <p className="mt-1 text-sm text-white/60">{description}</p>}
      </header>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function TextInput({
  label,
  name,
  placeholder,
  error,
  type = 'text',
  rows,
  hint,
}: {
  label: string;
  name: string;
  placeholder?: string;
  error?: string;
  type?: string;
  rows?: number;
  hint?: string;
}) {
  const baseClass = clsx(
    'w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-inner shadow-black/20 transition focus:border-white/30 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20',
    error && '!border-red-400/70 !bg-red-500/10 focus:ring-red-400/40'
  );

  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      {rows ? (
        <textarea name={name} placeholder={placeholder} className={baseClass} rows={rows} />
      ) : (
        <input name={name} placeholder={placeholder} className={baseClass} type={type} />
      )}
      {hint && <span className="text-xs text-white/40">{hint}</span>}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
  defaultValue,
}: {
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
  error?: string;
  defaultValue?: string;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm text-white/70">
      <span className="font-medium text-white">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
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
        {pending ? 'Publishing your project…' : success ?? 'Your new project will shine on the portfolio once saved.'}
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:shadow-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
      >
        {pending ? 'Saving…' : 'Create project'}
      </button>
    </div>
  );
}

export function ProjectForm() {
  const [state, formAction] = useActionState(createProject, initialProjectState);
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

  return (
    <form action={formAction} className="flex flex-col gap-8">
      <FieldGroup
        title="Project identity"
        description="Foundational metadata that anchors this case study across the site."
      >
        <TextInput label="Title" name="title" placeholder="Aurora – Immersive Banking" error={state.fieldErrors?.title} />
        <TextInput
          label="Slug"
          name="slug"
          hint="This maps to the project URL slug, e.g., /projects/aurora"
          placeholder="aurora-immersive-banking"
          error={state.fieldErrors?.slug}
        />
        <TextInput
          label="Summary"
          name="summary"
          rows={3}
          placeholder="Transforming a traditional bank into an immersive digital experience."
          error={state.fieldErrors?.summary}
        />
        <CloudinaryImageInput
          label="Hero image"
          name="heroImage"
          hint="Upload or select a cover visual straight from your Cloudinary media library."
          error={state.fieldErrors?.heroImage}
          folder="portfolio/projects/heroes"
        />
        <SelectField
          label="Project status"
          name="status"
          options={[
            { label: 'Draft', value: 'DRAFT' },
            { label: 'Published', value: 'PUBLISHED' },
            { label: 'Archived', value: 'ARCHIVED' },
          ]}
          defaultValue="DRAFT"
          error={state.fieldErrors?.status}
        />
        <label className="flex items-center gap-3 text-sm text-white/70">
          <input type="checkbox" name="isFeatured" className="h-4 w-4 rounded border-white/20 bg-white/10" />
          Highlight this project on the homepage hero carousel
        </label>
        <TextInput
          label="Featured order"
          name="featuredOrder"
          placeholder="1"
          error={state.fieldErrors?.featuredOrder}
          hint="Lower numbers appear first in featured showcases"
          type="number"
        />
      </FieldGroup>

      <FieldGroup
        title="Narrative"
        description="Tell the story—challenges, craft, impact. Markdown supported on the public site."
      >
        <TextInput
          label="Long-form description"
          name="description"
          rows={10}
          placeholder="Outline the brief, your approach, and the outcomes."
          error={state.fieldErrors?.description}
        />
        <TextInput
          label="Deliverables"
          name="deliverables"
          rows={6}
          placeholder="Product strategy\nMotion prototypes\nDesign system"
          hint="Separate each deliverable with a new line or comma"
          error={state.fieldErrors?.deliverables}
        />
        <TextInput
          label="Technologies"
          name="technologies"
          rows={6}
          placeholder="Figma\nFramer\nThree.js"
          hint="Separate each technology with a new line or comma"
          error={state.fieldErrors?.technologies}
        />
        <TextInput
          label="Tags"
          name="tags"
          rows={4}
          placeholder="Fintech, Experience Design, Accessibility"
          hint="Separate each tag with a new line or comma"
          error={state.fieldErrors?.tags}
        />
      </FieldGroup>

      <FieldGroup
        title="Timeline & links"
        description="Provide context for when the work happened and where to explore more."
      >
        <TextInput label="Project start" name="startDate" type="date" error={state.fieldErrors?.startDate} />
        <TextInput label="Project end" name="endDate" type="date" error={state.fieldErrors?.endDate} />
        <TextInput
          label="Live URL"
          name="liveUrl"
          placeholder="https://aurora.app"
          error={state.fieldErrors?.liveUrl}
          type="url"
        />
        <TextInput
          label="Source or press URL"
          name="sourceUrl"
          placeholder="https://behance.net/case-study"
          error={state.fieldErrors?.sourceUrl}
          type="url"
        />
        <TextInput
          label="Gallery"
          name="gallery"
          rows={6}
          placeholder={"https://cdn.com/aurora-1.jpg | Landing screen\nhttps://cdn.com/aurora-2.jpg | Conversion flow"}
          hint="One entry per line. Add an optional caption after a pipe (|)."
          error={state.fieldErrors?.gallery}
        />
        <TextInput
          label="Impact metrics"
          name="metrics"
          rows={6}
          placeholder={"Conversion lift | +34%\nApp store rating | 4.9"}
          hint="One metric per line using `Label | Value` format."
          error={state.fieldErrors?.metrics}
        />
      </FieldGroup>

      <FieldGroup
        title="SEO accents"
        description="Tailor how this case study surfaces in search and social previews."
      >
        <TextInput
          label="SEO title"
          name="seoTitle"
          placeholder="Aurora – Immersive banking experience design"
          error={state.fieldErrors?.seoTitle}
        />
        <TextInput
          label="SEO description"
          name="seoDescription"
          rows={4}
          placeholder="Case study showcasing a next-gen banking platform crafted with storytelling and measurable impact."
          error={state.fieldErrors?.seoDescription}
        />
      </FieldGroup>

      {state.status === 'error' && state.message && (
        <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-6 py-4 text-sm text-red-200">
          {state.message}
        </div>
      )}

      <SubmitBar success={success} />
    </form>
  );
}
