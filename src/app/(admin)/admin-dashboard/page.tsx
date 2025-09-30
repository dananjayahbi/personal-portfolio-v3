import Link from "next/link";
import prisma from "@/lib/prisma";
import type { ProjectStatus } from "@prisma/client";

export const metadata = {
  title: "Admin Dashboard | Portfolio Studio",
};

type RecentProject = {
  id: string;
  title: string;
  status: ProjectStatus;
  updatedAt: Date;
  isFeatured: boolean;
  featuredOrder: number | null;
};

const STATUS_STYLES: Record<ProjectStatus, string> = {
  DRAFT: "bg-amber-400/10 text-amber-200 border border-amber-400/20",
  PUBLISHED: "bg-emerald-400/10 text-emerald-200 border border-emerald-400/20",
  ARCHIVED: "bg-slate-400/10 text-slate-200 border border-slate-400/20",
};

function formatDate(date?: Date | null) {
  if (!date) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const [
    totalProjects,
    publishedProjects,
    draftProjects,
    archivedProjects,
    featuredProjects,
    recentProjects,
    portfolioContent,
    siteSettings,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.project.count({ where: { status: "DRAFT" } }),
    prisma.project.count({ where: { status: "ARCHIVED" } }),
    prisma.project.count({ where: { isFeatured: true, status: "PUBLISHED" } }),
    prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 4,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        isFeatured: true,
        featuredOrder: true,
      },
    }) as Promise<RecentProject[]>,
    prisma.portfolioContent.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } }),
  ]);

  const projectStats = [
    {
      label: "Total projects",
      value: totalProjects,
      detail: `${publishedProjects} published` as const,
    },
    {
      label: "Drafts awaiting polish",
      value: draftProjects,
      detail: draftProjects === 1 ? "1 draft" : `${draftProjects} drafts`,
    },
    {
      label: "Archived work",
      value: archivedProjects,
      detail: archivedProjects === 1 ? "1 archived" : `${archivedProjects} archived`,
    },
    {
      label: "Featured projects",
      value: featuredProjects,
      detail: featuredProjects ? "Live on homepage" : "Select features",
    },
  ];

  const portfolioLastUpdated = portfolioContent?.updatedAt ?? null;
  const settingsLastUpdated = siteSettings?.updatedAt ?? null;

  const quickLinks = [
    { href: "/add-project", title: "Add a project", description: "Launch a new spotlight case study." },
    {
      href: "/client-dashboard-content",
      title: "Refresh hero content",
      description: "Rewrite the story your audience sees first.",
    },
    {
      href: "/client-site-settings",
      title: "Tune site settings",
      description: "Contact, social presence, SEO fundamentals.",
    },
    { href: "/settings", title: "Admin profile", description: "Update your bio, avatar, and login details." },
  ];

  return (
    <div className="space-y-12">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Overview</p>
        <h1 className="text-3xl font-semibold text-white">Admin dashboard</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Stay ahead of your portfolio health. Track project momentum, recent edits, and jump straight into the
          workflows that keep your studio presence sharp.
        </p>
      </header>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {projectStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">{stat.label}</p>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-4xl font-semibold text-white">{stat.value}</span>
              <span className="text-xs text-white/50">{stat.detail}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">Recent activity</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Latest project moves</h2>
            </div>
            <Link
              href="/edit-project"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/30 hover:text-white"
            >
              Manage projects
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-white/50">No projects yet—create your first case study to see activity here.</p>
            ) : (
              recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-white/20 hover:bg-slate-900/50"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{project.title}</p>
                      <p className="text-xs text-white/50">Updated {formatDate(project.updatedAt)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[project.status]}`}>
                      {project.status.toLowerCase()}
                      {project.isFeatured && (
                        <span className="text-white/60">• featured #{project.featuredOrder ?? "—"}</span>
                      )}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-white/50">
                    <Link href={`/edit-project?projectId=${project.id}`} className="underline underline-offset-4">
                      Jump to editor
                    </Link>
                    <span>•</span>
                    <span className="text-white/40">Public case study view coming soon</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Quick actions</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Move fast</h2>
          <div className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-white/25 hover:bg-slate-900/60"
              >
                <p className="text-sm font-semibold text-white">{link.title}</p>
                <p className="mt-1 text-xs text-white/60">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Hero & narrative</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Client dashboard content</h2>
          <p className="mt-3 text-sm text-white/60">
            The public-facing dashboard experience is {portfolioContent ? "ready for review" : "awaiting configuration"}.
            {" "}
            {portfolioContent ? `Last updated ${formatDate(portfolioLastUpdated)}.` : "Start by defining your story."}
          </p>
          <Link
            href="/client-dashboard-content"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Edit dashboard narrative
          </Link>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">Foundation settings</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Site essentials</h2>
          <p className="mt-3 text-sm text-white/60">
            Your contact, social, and SEO configuration is {siteSettings ? "in place" : "not yet configured"}. {" "}
            {siteSettings ? `Last updated ${formatDate(settingsLastUpdated)}.` : "Complete the essentials to go live with confidence."}
          </p>
          <Link
            href="/client-site-settings"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/30 hover:text-white"
          >
            Update site settings
          </Link>
        </div>
      </section>
    </div>
  );
}
