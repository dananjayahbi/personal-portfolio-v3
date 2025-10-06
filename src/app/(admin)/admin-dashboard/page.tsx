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

function formatRelative(date?: Date | null) {
  if (!date) {
    return "No activity";
  }

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
      take: 6,
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

  const now = new Date();
  const formattedToday = new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);

  const publishCoverage = totalProjects === 0 ? 0 : Math.round((publishedProjects / totalProjects) * 100);
  const draftCoverage = totalProjects === 0 ? 0 : Math.round((draftProjects / totalProjects) * 100);

  const projectStats = [
    {
      label: "Total projects",
      value: totalProjects,
      detail: `${publishedProjects} published` as const,
      accent: "from-indigo-500/70 via-purple-500/60 to-sky-500/60",
    },
    {
      label: "Draft queue",
      value: draftProjects,
      detail: draftProjects === 1 ? "1 draft" : `${draftProjects} drafts`,
      accent: "from-amber-500/70 via-orange-500/60 to-red-500/50",
    },
    {
      label: "Archived work",
      value: archivedProjects,
      detail: archivedProjects === 1 ? "1 archived" : `${archivedProjects} archived`,
      accent: "from-slate-500/70 via-slate-600/60 to-slate-800/50",
    },
    {
      label: "Homepage features",
      value: featuredProjects,
      detail: featuredProjects ? "Featured spotlight" : "Select features",
      accent: "from-emerald-500/70 via-green-500/60 to-teal-500/50",
    },
  ];

  const pipeline = [
    {
      label: "Published",
      value: publishedProjects,
      percent: publishCoverage,
      gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    },
    {
      label: "Draft",
      value: draftProjects,
      percent: draftCoverage,
      gradient: "from-amber-400 via-amber-500 to-orange-500",
    },
    {
      label: "Archived",
      value: archivedProjects,
      percent: totalProjects === 0 ? 0 : Math.round((archivedProjects / totalProjects) * 100),
      gradient: "from-slate-500 via-slate-600 to-slate-700",
    },
  ];

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

  const contentHealth = [
    {
      title: "Dashboard narrative",
      status: portfolioContent ? "Configured" : "Needs setup",
      updatedAt: portfolioContent?.updatedAt ?? null,
      href: "/client-dashboard-content",
    },
    {
      title: "Site essentials",
      status: siteSettings ? "Configured" : "Pending",
      updatedAt: siteSettings?.updatedAt ?? null,
      href: "/client-site-settings",
    },
  ];

  const monthFormatter = new Intl.DateTimeFormat("en", { month: "short" });
  const velocityMonths = Array.from({ length: 6 }, (_, index) => {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return monthDate;
  });

  const velocitySeries = velocityMonths.map((monthDate) => {
    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();
    return recentProjects.filter((project) => {
      const updated = project.updatedAt;
      return updated.getMonth() === month && updated.getFullYear() === year;
    }).length;
  });

  const maxVelocity = Math.max(...velocitySeries, 1);
  const sparklinePoints = velocitySeries
    .map((value, index) => {
      const x = velocitySeries.length === 1 ? 0 : (index / (velocitySeries.length - 1)) * 100;
      const y = 100 - (value / maxVelocity) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  const sparklineArea = `0,100 ${sparklinePoints} 100,100`;
  const velocityLabels = velocityMonths.map((monthDate) => monthFormatter.format(monthDate));
  const currentVelocity = velocitySeries[velocitySeries.length - 1] ?? 0;
  const previousVelocity = velocitySeries[velocitySeries.length - 2] ?? 0;
  const momentumDelta = currentVelocity - previousVelocity;
  const momentumCopy =
    momentumDelta > 0
      ? `▲ ${momentumDelta} vs last month`
      : momentumDelta < 0
        ? `▼ ${Math.abs(momentumDelta)} vs last month`
        : "Stable vs last month";

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950/90 p-8 shadow-[0_30px_80px_-60px_rgba(79,70,229,0.5)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-white/40">Portfolio oversight</p>
            <h1 className="text-3xl font-semibold text-white">Admin dashboard</h1>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/60">
            {formattedToday}
          </div>
        </div>
        <p className="max-w-2xl text-sm text-white/65">
          Track portfolio momentum at a glance. Review publishing pipeline health, monitor recent activity, and jump into
          the workflows that keep your studio presence sharp.
        </p>
      </header>

      <section className="grid gap-5 lg:grid-cols-4 sm:grid-cols-2">
        {projectStats.map((stat) => (
          <div
            key={stat.label}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.08]"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-40`} />
            <div className="relative flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">{stat.label}</p>
              <div>
                <span className="text-4xl font-semibold text-white">{stat.value}</span>
                <p className="mt-2 text-xs text-white/60">{stat.detail}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/45">Publishing pipeline</p>
                <h2 className="text-xl font-semibold text-white">Portfolio health</h2>
              </div>
              <Link
                href="/edit-project"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-medium text-white/70 transition hover:border-white/30 hover:text-white"
              >
                Manage projects
              </Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {pipeline.map((segment) => (
                <div key={segment.label} className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>{segment.label}</span>
                    <span>{segment.value}</span>
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${segment.gradient}`}
                      style={{ width: `${segment.percent}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/40">{segment.percent}% of total catalogue</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Velocity</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Publishing momentum</h2>
                <p className="text-xs text-white/55">Updates shipped per month</p>
              </div>
              <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                {momentumCopy}
              </div>
            </div>
            <div className="mt-6 grid gap-6 md:grid-cols-[1fr,220px]">
              <div className="relative h-32 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
                  <polygon points={sparklineArea} fill="url(#areaGradient)" opacity={0.35} />
                  <polyline points={sparklinePoints} fill="none" stroke="url(#lineGradient)" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22D3EE" />
                      <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="pointer-events-none absolute inset-x-4 bottom-3 flex justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-white/45">
                  {velocityLabels.map((label) => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-white/60">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-white/45">This month</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{currentVelocity}</p>
                  <p className="mt-1 text-xs text-white/50">Updates shipped in {velocityLabels[velocityLabels.length - 1]}</p>
                </div>
                <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white/55">
                  <p>
                    Keep momentum by publishing new work or refreshing existing projects. Consistency boosts trust when
                    clients review your studio.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Recent activity</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Latest project moves</h2>
            <div className="mt-6 space-y-4">
              {recentProjects.length === 0 ? (
                <p className="text-sm text-white/50">
                  No projects yet—create your first case study to see activity populate this feed.
                </p>
              ) : (
                recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-white/20 hover:bg-slate-900/50"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{project.title}</p>
                        <p className="text-xs text-white/50">{formatRelative(project.updatedAt)} • Updated {formatDate(project.updatedAt)}</p>
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
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Next best actions</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Stay in flow</h2>
            <div className="mt-5 space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-2xl border border-white/5 bg-slate-950/60 p-4 transition hover:border-white/20 hover:bg-slate-900/60"
                >
                  <p className="text-sm font-semibold text-white">{link.title}</p>
                  <p className="mt-1 text-xs text-white/60">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Content health</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Launch readiness</h2>
            <div className="mt-5 space-y-4">
              {contentHealth.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/60 p-4 transition hover:border-white/20 hover:bg-slate-900/60"
                >
                  <div className="flex items-center justify-between text-sm text-white">
                    <span className="font-semibold">{item.title}</span>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/50">
                    {item.updatedAt ? `Last touched ${formatDate(item.updatedAt)} (${formatRelative(item.updatedAt)})` : 'Awaiting first update'}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-dashed border-white/10 bg-slate-950/40 p-6 text-sm text-white/50">
            <p className="text-xs uppercase tracking-[0.35em] text-white/45">Coming soon</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Traffic insights</h2>
            <p className="mt-3">
              Plug in analytics to unlock visitor traffic, acquisition sources, and conversion goals directly in your
              admin HQ. Connect Google Analytics or Plausible when you&apos;re ready.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
