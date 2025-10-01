import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProjectEditForm } from "../components/project-edit-form";

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

export default async function ProjectEditPage({ params }: { params: { projectId: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
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

  if (!project) {
    notFound();
  }

  const gallery = parseGallery(project.gallery);
  const seo = parseSeo(project.seo);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Project editor</p>
        <h1 className="text-3xl font-semibold text-white">{project.title}</h1>
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/45">
          <span className="rounded-full border border-white/15 px-3 py-1 uppercase tracking-[0.3em] text-white/40">/{project.slug}</span>
          <span>Created {project.createdAt.toLocaleDateString()}</span>
          <span>Updated {project.updatedAt.toLocaleDateString()}</span>
        </div>
        <p className="max-w-2xl text-sm text-white/60">{project.summary}</p>
      </header>

      <ProjectEditForm
        project={{
          id: project.id,
          title: project.title,
          slug: project.slug,
          summary: project.summary,
          description: project.description ?? "",
          heroImage: project.heroImage ?? "",
          gallery,
          technologies: project.technologies ?? [],
          tags: project.tags ?? [],
          liveUrl: project.liveUrl ?? "",
          sourceUrl: project.sourceUrl ?? "",
          status: project.status,
          isFeatured: project.isFeatured,
          featuredOrder: project.featuredOrder ?? null,
          seo,
        }}
      />
    </div>
  );
}
