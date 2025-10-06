import prisma from "@/lib/prisma";
import { ExperimentStatus } from "@prisma/client";
import { ExperimentCard } from "./components/experiment-card";
import { StatusFilter } from "./components/status-filter";
import { Pagination } from "./components/pagination";

const PROJECTS_PER_PAGE = 10;

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function formatRelative(date: Date) {
  const now = Date.now();
  const diff = date.getTime() - now;
  const minutes = Math.round(diff / (1000 * 60));
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, "minute");
  }
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, "hour");
  }
  return rtf.format(days, "day");
}

type ManageExperiment = {
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
  updatedAt: Date;
  createdAt: Date;
};

export default async function EditExperimentPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const currentPage = page ? Math.max(1, parseInt(page, 10)) : 1;
  const statusFilter = status && ['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(status)
    ? (status as ExperimentStatus)
    : undefined;

  const whereClause = statusFilter ? { status: statusFilter } : undefined;

  const [experiments, totalCount] = await Promise.all([
    prisma.experiment.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" },
      skip: (currentPage - 1) * PROJECTS_PER_PAGE,
      take: PROJECTS_PER_PAGE,
      select: {
        id: true,
        title: true,
        slug: true,
        summary: true,
        heroImage: true,
        status: true,
        isFeatured: true,
        featuredOrder: true,
        technologies: true,
        tags: true,
        updatedAt: true,
        createdAt: true,
      },
    }),
    prisma.experiment.count({ where: whereClause }),
  ]);

  const totalPages = Math.ceil(totalCount / PROJECTS_PER_PAGE);

  if (experiments.length === 0) {
    return (
      <div className="space-y-8">
        <header className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Portfolio library</p>
          <h1 className="text-3xl font-semibold text-white">Curate existing experiments</h1>
          <p className="max-w-2xl text-sm text-white/60">
            Refine storytelling, update impact metrics, and orchestrate the experiment lineup. Every adjustment is immediately reflected on the live experience.
          </p>
        </header>

        <StatusFilter currentStatus={statusFilter} />

        <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/60">
          {statusFilter 
            ? `No ${statusFilter.toLowerCase()} experiments yet.`
            : "No experiments yet. Launch your first flagship case study from the \"Add Experiment\" tab."
          }
        </div>
      </div>
    );
  }

  const cards: Array<ManageExperiment & {
    updatedRelative: string;
    updatedLabel: string;
    createdLabel: string;
  }> = experiments.map((experiment) => ({
    ...experiment,
    updatedRelative: formatRelative(experiment.updatedAt),
    updatedLabel: formatDate(experiment.updatedAt),
    createdLabel: formatDate(experiment.createdAt),
  }));

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Portfolio library</p>
        <h1 className="text-3xl font-semibold text-white">Curate existing experiments</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Review all published work at a glance. Open any card to refine details, refresh visuals, or archive outdated case studies.
        </p>
      </header>

      <StatusFilter currentStatus={statusFilter} />

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((experiment) => (
          <ExperimentCard key={experiment.id} experiment={experiment} />
        ))}
      </section>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          statusFilter={statusFilter}
        />
      )}
    </div>
  );
}