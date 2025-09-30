import prisma from "@/lib/prisma";
import { ProjectEditorCard } from "./components/project-editor-card";

function parseGallery(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (item && typeof item === 'object' && 'url' in item) {
      const record = item as { url?: unknown; alt?: unknown };
      if (typeof record.url === 'string') {
        return [{ url: record.url, alt: typeof record.alt === 'string' ? record.alt : null }];
      }
    }
    return [];
  });
}

function parseMetrics(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (item && typeof item === 'object' && 'label' in item && 'metric' in item) {
      const record = item as { label?: unknown; metric?: unknown };
      if (typeof record.label === 'string' && typeof record.metric === 'string') {
        return [{ label: record.label, metric: record.metric }];
      }
    }
    return [];
  });
}

function formatDateInput(value: Date | null) {
  if (!value) return null;
  const iso = value.toISOString();
  return iso.split('T')[0] ?? null;
}

export default async function EditProjectPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Portfolio library</p>
        <h1 className="text-3xl font-semibold text-white">Curate existing projects</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Refine storytelling, update impact metrics, and orchestrate the project lineup. Every adjustment is immediately reflected on the live experience.
        </p>
      </header>

      <div className="space-y-6">
        {projects.length === 0 && (
          <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/60">
            No projects yet. Launch your first flagship case study from the “Add Project” tab.
          </div>
        )}

        {projects.map((project) => (
          <ProjectEditorCard
            key={project.id}
            project={{
              id: project.id,
              title: project.title,
              slug: project.slug,
              summary: project.summary,
              description: project.description,
              heroImage: project.heroImage,
              technologies: project.technologies ?? [],
              tags: project.tags ?? [],
              deliverables: project.deliverables ?? [],
              liveUrl: project.liveUrl,
              sourceUrl: project.sourceUrl,
              status: project.status,
              isFeatured: project.isFeatured,
              featuredOrder: project.featuredOrder,
              startDate: formatDateInput(project.startDate ?? null),
              endDate: formatDateInput(project.endDate ?? null),
              gallery: parseGallery(project.gallery),
              metrics: parseMetrics(project.metrics),
              seo: (project.seo as { title?: string | null; description?: string | null } | null) ?? null,
            }}
          />
        ))}
      </div>
    </div>
  );
}