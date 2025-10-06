'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import clsx from "clsx";
import type { ExperimentStatus } from "@prisma/client";
import { deleteExperimentById } from "../actions";

type ExperimentCardProps = {
  experiment: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    heroImage: string | null;
    status: ExperimentStatus;
    isFeatured: boolean;
    featuredOrder: number | null;
    technologies: string[];
    tags: string[];
    createdLabel: string;
    updatedLabel: string;
    updatedRelative: string;
  };
};

const STATUS_BADGES: Record<ExperimentStatus, string> = {
  DRAFT: "border-amber-400/30 bg-amber-500/10 text-amber-100",
  PUBLISHED: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
  ARCHIVED: "border-slate-400/40 bg-slate-500/10 text-slate-200",
};

export function ExperimentCard({ experiment }: ExperimentCardProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteExperimentById(experiment.id);
      if (result.status === "success") {
        setConfirming(false);
        router.refresh();
        return;
      }
      setError(result.message ?? "Unable to delete the experiment. Try again.");
    });
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_25px_60px_-45px_rgba(20,184,166,0.45)] transition hover:border-white/20 hover:bg-white/10">
      <div className="relative h-48 overflow-hidden border-b border-white/10 bg-slate-900/70">
        {experiment.heroImage ? (
          <img
            src={experiment.heroImage}
            alt={`${experiment.title} hero visual`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-xs text-white/50">
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.25em] text-white/40">
              No hero
            </span>
            <p className="max-w-[80%] text-center text-white/60">Add a hero image to elevate this card.</p>
          </div>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={clsx(
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide",
              STATUS_BADGES[experiment.status]
            )}
          >
            {experiment.status.toLowerCase()}
          </span>
          {experiment.isFeatured && (
            <span className="inline-flex items-center rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
              Featured #{experiment.featuredOrder ?? "—"}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-5 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/40">
            <span>/{experiment.slug}</span>
            <span title={`Updated ${experiment.updatedLabel}`}>{experiment.updatedRelative}</span>
          </div>
          <h3 className="text-xl font-semibold text-white">{experiment.title}</h3>
          <p className="text-sm text-white/60">{experiment.summary}</p>
        </div>

        {(experiment.technologies.length > 0 || experiment.tags.length > 0) && (
          <div className="flex flex-wrap gap-2 text-xs text-white/55">
            {[...experiment.technologies.slice(0, 3), ...experiment.tags.slice(0, 2)].map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-white/60"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 text-xs text-white/45">
          <span title={`Created ${experiment.createdLabel}`}>Created {experiment.createdLabel}</span>
          <span>Updated {experiment.updatedLabel}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/edit-experiment/${experiment.id}`}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:border-white/30 hover:text-white"
          >
            Edit details
          </Link>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex items-center gap-2 rounded-full border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-100 transition hover:border-red-400/60"
          >
            Delete
          </button>
        </div>

        {error && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs text-red-200">
            {error}
          </div>
        )}
      </div>

      {confirming && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90 p-6">
          <div className="flex w-full max-w-xs flex-col gap-4 rounded-2xl border border-white/10 bg-slate-900/90 p-5 text-center text-white">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">Delete experiment?</h4>
              <p className="text-sm text-white/60">
                This permanently removes <span className="font-semibold text-white">{experiment.title}</span> from your portfolio.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-xs text-white/60">
              <span>Created {experiment.createdLabel}</span>
              <span>Last updated {experiment.updatedLabel}</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full border border-red-400/50 bg-red-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-100 transition hover:border-red-400/80 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={pending}
              >
                {pending ? "Removing…" : "Yes, delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-full border border-white/15 bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/30 hover:text-white"
                disabled={pending}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
