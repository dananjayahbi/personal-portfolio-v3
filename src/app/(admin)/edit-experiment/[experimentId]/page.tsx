import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ExperimentEditForm } from "../components/experiment-edit-form";

function parseGallery(value: unknown) {
  if (!Array.isArray(value)) return [] as Array<{ url: string; alt: string | null }>;
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [] as Array<{ url: string; alt: string | null }>;
    const record = item as { url?: unknown; alt?: unknown };
    if (typeof record.url !== "string") return [] as Array<{ url: string; alt: string | null }>;
    return [{ url: record.url, alt: typeof record.alt === "string" ? record.alt : null }];
  });
}

function parseSeo(value: unknown) {
  if (!value || typeof value !== "object") return { title: "", description: "" };
  const record = value as { title?: unknown; description?: unknown };
  return {
    title: typeof record.title === "string" ? record.title : "",
    description: typeof record.description === "string" ? record.description : "",
  };
}

export default async function ExperimentEditPage({ params }: { params: Promise<{ experimentId: string }> }) {
  const { experimentId } = await params;
  const experiment = await prisma.experiment.findUnique({
    where: { id: experimentId },
    select: {
      id: true,
      title: true,
      slug: true,
      summary: true,
      description: true,
      heroImage: true,
      gallery: true,
      technologies: true,
      tags: true,
      liveUrl: true,
      sourceUrl: true,
      status: true,
      isFeatured: true,
      featuredOrder: true,
      seo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!experiment) {
    notFound();
  }

  const gallery = parseGallery(experiment.gallery);
  const seo = parseSeo(experiment.seo);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Experiment editor</p>
        <h1 className="text-3xl font-semibold text-white">{experiment.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/45">
          <span className="rounded-full border border-white/15 px-3 py-1 uppercase tracking-[0.3em] text-white/40">/{experiment.slug}</span>
          <span>Created {experiment.createdAt.toLocaleDateString()}</span>
          <span>Updated {experiment.updatedAt.toLocaleDateString()}</span>
        </div>
        <p className="max-w-2xl text-sm text-white/60">{experiment.summary}</p>
      </header>

      <ExperimentEditForm
        experiment={{
          id: experiment.id,
          title: experiment.title,
          slug: experiment.slug,
          summary: experiment.summary,
          description: experiment.description ?? "",
          heroImage: experiment.heroImage ?? "",
          gallery,
          technologies: experiment.technologies ?? [],
          tags: experiment.tags ?? [],
          liveUrl: experiment.liveUrl ?? "",
          sourceUrl: experiment.sourceUrl ?? "",
          status: experiment.status,
          isFeatured: experiment.isFeatured,
          featuredOrder: experiment.featuredOrder ?? null,
          seo,
        }}
      />
    </div>
  );
}
