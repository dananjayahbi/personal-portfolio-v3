import prisma from "@/lib/prisma";
import { ProjectStatus, Prisma } from "@prisma/client";
import { cache } from "react";

export interface ProjectFilters {
  status?: ProjectStatus;
  technologies?: string[];
  tags?: string[];
  isFeatured?: boolean;
  search?: string;
}

export const getPublishedProjects = cache(async (filters?: ProjectFilters) => {
  const where: Prisma.ProjectWhereInput = {
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

  const projects = await prisma.project.findMany({
    where,
    orderBy: [
      { isFeatured: "desc" },
      { featuredOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  return projects;
});

export const getFeaturedProjects = cache(async (limit: number = 6) => {
  // First, try to get featured projects
  const featured = await prisma.project.findMany({
    where: {
      status: ProjectStatus.PUBLISHED,
      isFeatured: true,
    },
    orderBy: [{ featuredOrder: "asc" }, { createdAt: "desc" }],
    take: limit,
  });

  // If no featured projects, fallback to recent published projects
  if (featured.length === 0) {
    return await prisma.project.findMany({
      where: {
        status: ProjectStatus.PUBLISHED,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  return featured;
});

export const getProjectBySlug = cache(async (slug: string) => {
  return await prisma.project.findUnique({
    where: {
      slug,
      status: ProjectStatus.PUBLISHED,
    },
  });
});

export const getRelatedProjects = cache(
  async (projectId: string, technologies: string[], limit: number = 3) => {
    return await prisma.project.findMany({
      where: {
        status: ProjectStatus.PUBLISHED,
        id: { not: projectId },
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
  const projects = await prisma.project.findMany({
    where: { status: ProjectStatus.PUBLISHED },
    select: { technologies: true },
  });

  const allTechnologies = projects.flatMap((p) => p.technologies);
  return Array.from(new Set(allTechnologies)).sort();
});

export const getAllTags = cache(async () => {
  const projects = await prisma.project.findMany({
    where: { status: ProjectStatus.PUBLISHED },
    select: { tags: true },
  });

  const allTags = projects.flatMap((p) => p.tags);
  return Array.from(new Set(allTags)).sort();
});
