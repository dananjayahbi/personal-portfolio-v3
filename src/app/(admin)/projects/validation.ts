import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().trim().min(4, "Give the project a memorable title"),
  summary: z.string().trim().min(12, "Write a punchy summary"),
  slug: z
    .string({ required_error: "Slug is required" })
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only"),
  description: z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const normalized = value.replace(/\s+/g, " ").trim();
      return normalized.length ? value : undefined;
    }),
  heroImage: z
    .string()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.string().url("Enter a valid URL").optional()),
  gallery: z.string().trim().optional(),
  technologies: z.string().trim().optional(),
  tags: z.string().trim().optional(),
  liveUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.string().url("Enter a valid URL").optional()),
  sourceUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .pipe(z.string().url("Enter a valid URL").optional()),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  isFeatured: z.string().optional(),
  featuredOrder: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), "Enter a valid number"),
  seoTitle: z.string().trim().optional(),
  seoDescription: z.string().trim().optional(),
});

type ProjectFormInput = z.infer<typeof projectFormSchema>;

export type ProjectFieldErrors = Partial<Record<keyof ProjectFormInput, string>>;

export function parseList(value?: string | null) {
  if (!value) return [] as string[];
  return value
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function parseGallery(value?: string | null) {
  if (!value) return undefined;
  const items = value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, alt] = line.split('|').map((part) => part?.trim());
      if (!url) return null;
      return { url, alt: alt || null };
    })
    .filter(Boolean) as Array<{ url: string; alt: string | null }>;
  return items.length ? items : undefined;
}

export function buildProjectData(data: ProjectFormInput) {
  const technologies = parseList(data.technologies);
  const tags = parseList(data.tags);
  const gallery = parseGallery(data.gallery);

  return {
    title: data.title,
    slug: data.slug,
    summary: data.summary,
    description: data.description ?? null,
    heroImage: data.heroImage,
    gallery,
    technologies,
    tags,
    status: data.status,
    isFeatured: Boolean(data.isFeatured),
    featuredOrder: data.isFeatured
      ? data.featuredOrder
        ? Number.parseInt(data.featuredOrder, 10)
        : null
      : null,
    liveUrl: data.liveUrl,
    sourceUrl: data.sourceUrl,
    seo: data.seoTitle || data.seoDescription ? { title: data.seoTitle, description: data.seoDescription } : undefined,
  };
}
