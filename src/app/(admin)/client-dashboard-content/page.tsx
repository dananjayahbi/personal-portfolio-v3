import prisma from "@/lib/prisma";
import { DashboardContentForm } from "./components/dashboard-content-form";

function toText(value: unknown) {
  return typeof value === 'string' ? value : '';
}

function toStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }
  return [];
}

function toExperiencesArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is { company: string; role: string; period: string; description?: string } => {
      return typeof item === 'object' && item !== null && 
             'company' in item && 'role' in item && 'period' in item;
    });
  }
  return [];
}

export default async function ClientDashboardContentPage() {
  const content = await prisma.portfolioContent.findFirst();

  const hero = (content?.hero as Record<string, unknown> | null) ?? null;
  const ctas = (content?.callToActions as Record<string, unknown> | null) ?? null;
  const about = (content?.about as Record<string, unknown> | null) ?? null;

  const defaults = {
    heroEyebrow: toText(hero?.eyebrow),
    heroHeadline: toText(hero?.headline),
    heroSubheadline: toText(hero?.subheadline),
    highlights: toStringArray(hero?.highlights),
    primaryCtaLabel: toText((ctas?.primary as Record<string, unknown> | null)?.label),
    primaryCtaUrl: toText((ctas?.primary as Record<string, unknown> | null)?.url),
    secondaryCtaLabel: toText((ctas?.secondary as Record<string, unknown> | null)?.label),
    secondaryCtaUrl: toText((ctas?.secondary as Record<string, unknown> | null)?.url),
    aboutTitle: toText(about?.title),
    aboutSummary: toText(about?.summary),
    aboutNarrative: toText(about?.narrative),
    experiences: toExperiencesArray(content?.experiences),
  };

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Client-facing experience</p>
        <h1 className="text-3xl font-semibold text-white">Dashboard storytelling</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Shape the hero narrative, create powerful calls-to-action, and articulate your expertise. These updates sync
          instantly with the public homepage experience.
        </p>
      </header>

      <DashboardContentForm defaults={defaults} />
    </div>
  );
}