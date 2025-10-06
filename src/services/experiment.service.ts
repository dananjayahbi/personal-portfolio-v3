import prisma from "@/lib/prisma";
import { Experiment, ProjectStatus } from "@prisma/client";
import { cache } from "react";

export interface ExperimentFilters {
  status?: ProjectStatus;
  technologies?: string[];
  tags?: string[];
  isFeatured?: boolean;
  search?: string;
}

export const getPublishedExperiments = cache(async (filters?: ExperimentFilters) => {
  const where: any = {
    status: ProjectStatus.PUBLISHED,
  };

  if (filters?.technologies && filters.technologies.length > 0) {
    where.technologies = { hasSome: filters.technologies };
  }

  if (filters?.tags && filters.tags.length > 0) {
    where.tags = { hasSome: filters.tags };
  }

  if (filters?.isFeatured !== undefined) {
    where.isFeatured = filters.isFeatured;
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { summary: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const experiments = await prisma.experiment.findMany({
    where,
    orderBy: [
      { isFeatured: "desc" },
      { featuredOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return experiments;
});

export const getFeaturedExperiments = cache(async (limit: number = 6) => {
  // First, try to get featured experiments
  const featured = await prisma.experiment.findMany({
    where: {
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
    },
    orderBy: [{ featuredOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
  });

  // If no featured experiments, fallback to recent published experiments
  if (featured.length === 0) {
    return await prisma.experiment.findMany({
      where: {
        status: ProjectStatus.PUBLISHED,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  return featured;
});

export const getExperimentBySlug = cache(async (slug: string) => {
  return await prisma.experiment.findUnique({
    where: {
      slug,
      status: ProjectStatus.PUBLISHED,
    },
  });
});

export const getRelatedExperiments = cache(
  async (experimentId: string, technologies: string[], limit: number = 3) => {
    return await prisma.experiment.findMany({
      where: {
        status: ProjectStatus.PUBLISHED,
        id: { not: experimentId },
        OR: [
          { technologies: { hasSome: technologies } },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
);

export const getAllTechnologies = cache(async () => {
  const experiments = await prisma.experiment.findMany({
    where: { status: ProjectStatus.PUBLISHED },
    select: { technologies: true },
  });

  const allTechnologies = experiments.flatMap((p) => p.technologies);
  return Array.from(new Set(allTechnologies)).sort();
});

export const getAllTags = cache(async () => {
  const experiments = await prisma.experiment.findMany({
    where: { status: ProjectStatus.PUBLISHED },
    select: { tags: true },
  });

  const allTags = experiments.flatMap((p) => p.tags);
  return Array.from(new Set(allTags)).sort();
});
