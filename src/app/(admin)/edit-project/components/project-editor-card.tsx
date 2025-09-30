'use client';

import { useEffect, useState, useActionState } from "react";
import { useFormStatus } from "react-dom";
import clsx from "clsx";
import { deleteProject, initialUpdateState, updateProject } from "../actions";
import { CloudinaryImageInput } from "@/components/common/cloudinary-image-input";

type Project = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  heroImage?: string | null;
  technologies: string[];
  tags: string[];
  deliverables: string[];
  liveUrl?: string | null;
  sourceUrl?: string | null;
  status: string;
  isFeatured: boolean;
  featuredOrder?: number | null;
  startDate?: string | null;
  endDate?: string | null;
  gallery?: Array<{ url: string; alt?: string | null }> | null;
  metrics?: Array<{ label: string; metric: string }> | null;
  seo?: { title?: string | null; description?: string | null } | null;
};

function TextInput({
  label,
  name,
  defaultValue,
  error,
  rows,
  type = 'text',
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
  rows?: number;
  type?: string;
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
        <textarea name={name} defaultValue={defaultValue} className={baseClass} rows={rows} />
      ) : (
        <input name={name} defaultValue={defaultValue} className={baseClass} type={type} />
      )}
      {hint && <span className="text-xs text-white/40">{hint}</span>}
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  error?: string;
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
        <option value="DRAFT" className="text-slate-900">
          Draft
        </option>
        <option value="PUBLISHED" className="text-slate-900">
          Published
        </option>
        <option value="ARCHIVED" className="text-slate-900">
          Archived
        </option>
      </select>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  );
}

function FormFooter({ success }: { success?: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4">
      <span className="text-sm text-white/70">
        {pending ? 'Syncing updates…' : success ?? 'Changes go live instantly across the portfolio.'}
      </span>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition hover:shadow-rose-500/50 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
      >
        {pending ? 'Saving…' : 'Save project'}
      </button>
    </div>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded-full border border-red-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
      disabled={pending}
    >
      {pending ? 'Deleting…' : 'Delete project'}
    </button>
  );
}

function formatArray(values: string[]) {
  return values.join('\n');
}

function formatGallery(gallery?: Project['gallery']) {
  if (!gallery?.length) return '';
  return gallery.map((item) => `${item.url}${item.alt ? ` | ${item.alt}` : ''}`).join('\n');
}

function formatMetrics(metrics?: Project['metrics']) {
  if (!metrics?.length) return '';
  return metrics.map((item) => `${item.label} | ${item.metric}`).join('\n');
}

export function ProjectEditorCard({ project }: { project: Project }) {
  const [state, formAction] = useActionState(updateProject, initialUpdateState);
  const [deleteState, deleteAction] = useActionState(deleteProject, initialUpdateState);
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
    <details className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl" open>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">{project.status}</p>
          <h3 className="text-xl font-semibold text-white">{project.title}</h3>
          <p className="text-sm text-white/60">/{project.slug}</p>
        </div>
        <span
          className={clsx(
            'rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide',
            project.isFeatured
              ? 'border border-amber-400/60 bg-amber-500/10 text-amber-200'
              : 'border border-white/10 bg-white/10 text-white/60'
          )}
        >
          {project.isFeatured ? `Featured #${project.featuredOrder ?? 1}` : 'Standard' }
        </span>
      </summary>

      <div className="border-t border-white/10">
        <form action={formAction} className="flex flex-col gap-6 px-5 py-6 md:px-6">
          <input type="hidden" name="projectId" value={project.id} />

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Title" name="title" defaultValue={project.title} error={state.fieldErrors?.title} />
            <TextInput label="Slug" name="slug" defaultValue={project.slug} error={state.fieldErrors?.slug} />
            <TextInput
              label="Summary"
              name="summary"
              defaultValue={project.summary}
              rows={3}
              error={state.fieldErrors?.summary}
            />
            <SelectField
              label="Status"
              name="status"
              defaultValue={project.status}
              error={state.fieldErrors?.status}
            />
            <label className="flex items-center gap-3 text-sm text-white/70 md:col-span-2">
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={project.isFeatured}
                className="h-4 w-4 rounded border-white/20 bg-white/10"
              />
              Feature this project on the homepage hero carousel
            </label>
            <TextInput
              label="Featured order"
              name="featuredOrder"
              defaultValue={project.featuredOrder?.toString()}
              type="number"
              error={state.fieldErrors?.featuredOrder}
            />
              <CloudinaryImageInput
                label="Hero image"
                name="heroImage"
                defaultValue={project.heroImage ?? undefined}
                error={state.fieldErrors?.heroImage}
                folder="portfolio/projects/heroes"
              />
          </div>

          <TextInput
            label="Long-form description"
            name="description"
            defaultValue={project.description}
            error={state.fieldErrors?.description}
            rows={8}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Deliverables"
              name="deliverables"
              defaultValue={formatArray(project.deliverables)}
              rows={5}
              error={state.fieldErrors?.deliverables}
            />
            <TextInput
              label="Technologies"
              name="technologies"
              defaultValue={formatArray(project.technologies)}
              rows={5}
              error={state.fieldErrors?.technologies}
            />
            <TextInput
              label="Tags"
              name="tags"
              defaultValue={formatArray(project.tags)}
              rows={4}
              error={state.fieldErrors?.tags}
            />
            <TextInput
              label="Gallery"
              name="gallery"
              defaultValue={formatGallery(project.gallery)}
              rows={5}
              error={state.fieldErrors?.gallery}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Live URL"
              name="liveUrl"
              defaultValue={project.liveUrl ?? undefined}
              error={state.fieldErrors?.liveUrl}
            />
            <TextInput
              label="Source or press URL"
              name="sourceUrl"
              defaultValue={project.sourceUrl ?? undefined}
              error={state.fieldErrors?.sourceUrl}
            />
            <TextInput
              label="Project start"
              name="startDate"
              type="date"
              defaultValue={project.startDate ?? undefined}
              error={state.fieldErrors?.startDate}
            />
            <TextInput
              label="Project end"
              name="endDate"
              type="date"
              defaultValue={project.endDate ?? undefined}
              error={state.fieldErrors?.endDate}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Impact metrics"
              name="metrics"
              defaultValue={formatMetrics(project.metrics)}
              rows={5}
              error={state.fieldErrors?.metrics}
            />
            <div className="grid gap-4">
              <TextInput
                label="SEO title"
                name="seoTitle"
                defaultValue={project.seo?.title ?? undefined}
                error={state.fieldErrors?.seoTitle}
              />
              <TextInput
                label="SEO description"
                name="seoDescription"
                defaultValue={project.seo?.description ?? undefined}
                rows={4}
                error={state.fieldErrors?.seoDescription}
              />
            </div>
          </div>

          {state.status === 'error' && state.message && (
            <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-6 py-4 text-sm text-red-200">
              {state.message}
            </div>
          )}

          <FormFooter success={success} />
        </form>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-5 py-4 text-xs text-white/40 md:px-6">
          <span>Project ID: {project.id}</span>
          <form action={deleteAction} className="flex items-center gap-3">
            <input type="hidden" name="projectId" value={project.id} />
            {deleteState.status === 'error' && deleteState.message && (
              <span className="text-red-300">{deleteState.message}</span>
            )}
            <DeleteButton />
          </form>
        </div>
      </div>
    </details>
  );
}
