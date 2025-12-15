import prisma from "@/lib/prisma";
import { SiteSettingsForm } from "./components/site-settings-form";

function parseSocialLinks(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (entry && typeof entry === 'object') {
      const record = entry as { platform?: unknown; url?: unknown };
      if (typeof record.platform === 'string' && typeof record.url === 'string') {
        return [{ platform: record.platform, url: record.url }];
      }
    }
    return [];
  });
}

function parseKeywords(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export default async function ClientSiteSettingsPage() {
  const settings = await prisma.siteSettings.findFirst();

  const seoRaw = (settings?.seo as
    | { title?: string | null; description?: string | null; keywords?: unknown; image?: string | null }
    | null) ?? null;
  const themeRaw = (settings?.theme as { accent?: string | null; mode?: string | null } | null) ?? null;

  const defaults = {
    contactEmail: settings?.contactEmail ?? undefined,
    contactPhone: settings?.contactPhone ?? undefined,
    location: settings?.location ?? undefined,
    availability: settings?.availability ?? undefined,
    resumeUrl: settings?.resumeUrl ?? undefined,
    resumeCloudinaryUrl: settings?.resumeCloudinaryUrl ?? undefined,
    socialLinks: parseSocialLinks(settings?.socialLinks ?? []),
    seo: seoRaw
      ? {
          title: seoRaw.title ?? undefined,
          description: seoRaw.description ?? undefined,
          keywords: parseKeywords(seoRaw.keywords ?? []),
          image: seoRaw.image ?? undefined,
        }
      : null,
    theme: themeRaw
      ? {
          accent: themeRaw.accent ?? undefined,
          mode: themeRaw.mode ?? undefined,
        }
      : null,
    footerNote: settings?.footerNote ?? undefined,
  };

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Experience controls</p>
        <h1 className="text-3xl font-semibold text-white">Site-wide settings</h1>
        <p className="max-w-2xl text-sm text-white/60">
          Configure how prospects connect, how search engines discover you, and how the portfolio looks under different ambient lighting.
        </p>
      </header>

      <SiteSettingsForm defaults={defaults} />
    </div>
  );
}