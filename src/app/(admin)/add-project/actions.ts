'use server';

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { buildProjectData, projectFormSchema, type ProjectFieldErrors } from "@/app/(admin)/projects/validation";

type ProjectState = {
  status: 'idle' | 'success' | 'error';
  message?: string;
  fieldErrors?: ProjectFieldErrors;
};

export const initialProjectState: ProjectState = { status: 'idle' };

export async function createProject(_: ProjectState, formData: FormData): Promise<ProjectState> {
  const parsed = projectFormSchema.safeParse({
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
  const errors: ProjectFieldErrors = {};
    for (const key of Object.keys(fieldErrors) as Array<keyof typeof fieldErrors>) {
      errors[key] = fieldErrors[key]?.[0];
    }
    return {
      status: 'error',
      message: 'We spotted a few issues—refine the highlighted fields.',
      fieldErrors: errors,
    };
  }

  const data = parsed.data;

  const existing = await prisma.project.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return {
      status: 'error',
      message: 'A project with this slug already exists. Try a different slug or edit the existing project.',
      fieldErrors: { slug: 'Slug already in use' },
    };
  }

  const projectData = buildProjectData(data);

  await prisma.project.create({
    data: projectData,
  });

  revalidatePath('/edit-project');

  return {
    status: 'success',
    message: 'Project published to your portfolio universe. You can refine it anytime.',
  };
}
