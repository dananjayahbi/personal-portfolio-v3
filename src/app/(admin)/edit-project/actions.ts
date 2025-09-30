'use server';

import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import {
  buildProjectData,
  projectFormSchema,
  type ProjectFieldErrors,
} from "@/app/(admin)/projects/validation";

const updateSchema = projectFormSchema.extend({
  projectId: z.string().trim().min(1, "Missing project id"),
});

const deleteSchema = z.object({
  projectId: z.string().trim().min(1, "Missing project id"),
});

type ProjectState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: ProjectFieldErrors & { projectId?: string };
};

export const initialUpdateState: ProjectState = { status: 'idle' };

function normalizeUpdatePayload(data: ReturnType<typeof buildProjectData>) {
  return {
    ...data,
    heroImage: data.heroImage ?? null,
    liveUrl: data.liveUrl ?? null,
    sourceUrl: data.sourceUrl ?? null,
    gallery: data.gallery ?? null,
    metrics: data.metrics ?? null,
    seo: data.seo ?? null,
    startDate: data.startDate ?? null,
    endDate: data.endDate ?? null,
  };
}

export async function updateProject(_: ProjectState, formData: FormData): Promise<ProjectState> {
  const parsed = updateSchema.safeParse({
    projectId: formData.get('projectId'),
    title: formData.get('title'),
    slug: formData.get('slug'),
    summary: formData.get('summary'),
    description: formData.get('description'),
    heroImage: formData.get('heroImage'),
    gallery: formData.get('gallery'),
    technologies: formData.get('technologies'),
    tags: formData.get('tags'),
    deliverables: formData.get('deliverables'),
    liveUrl: formData.get('liveUrl'),
    sourceUrl: formData.get('sourceUrl'),
    status: formData.get('status'),
    isFeatured: formData.get('isFeatured'),
    featuredOrder: formData.get('featuredOrder'),
    startDate: formData.get('startDate'),
    endDate: formData.get('endDate'),
    metrics: formData.get('metrics'),
    seoTitle: formData.get('seoTitle'),
    seoDescription: formData.get('seoDescription'),
  });

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten();
    const errors: ProjectState['fieldErrors'] = {};
    for (const [key, value] of Object.entries(fieldErrors)) {
      if (value?.[0]) {
        (errors as Record<string, string>)[key] = value[0];
      }
    }
    return {
      status: 'error',
      message: 'Please review the highlighted fields before saving.',
      fieldErrors: errors,
    };
  }

  const data = parsed.data;
  const project = await prisma.project.findUnique({ where: { id: data.projectId } });
  if (!project) {
    return { status: 'error', message: 'Project not found. Refresh and try again.' };
  }

  if (data.slug !== project.slug) {
    const slugConflict = await prisma.project.findUnique({ where: { slug: data.slug } });
    if (slugConflict) {
      return {
        status: 'error',
        message: 'Another project already uses this slug. Choose a different slug.',
        fieldErrors: { slug: 'Slug already in use' },
      };
    }
  }

  const projectData = normalizeUpdatePayload(buildProjectData(data));

  await prisma.project.update({
    where: { id: data.projectId },
    data: projectData,
  });

  revalidatePath('/edit-project');
  revalidatePath('/client-dashboard-content');

  return {
    status: 'success',
    message: 'Project updated successfully',
  };
}

export async function deleteProject(_: ProjectState, formData: FormData): Promise<ProjectState> {
  const parsed = deleteSchema.safeParse({ projectId: formData.get('projectId') });
  if (!parsed.success) {
    return {
      status: 'error',
      message: 'Missing project reference.',
      fieldErrors: { projectId: 'Missing project id' },
    };
  }

  await prisma.project.delete({ where: { id: parsed.data.projectId } });

  revalidatePath('/edit-project');
  revalidatePath('/client-dashboard-content');

  return {
    status: 'success',
    message: 'Project deleted successfully',
  };
}
