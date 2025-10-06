'use server';

import prisma from "@/lib/prisma";
import { Technology } from "@prisma/client";

export async function getAllTechnologies(): Promise<Technology[]> {
  return await prisma.technology.findMany({
    orderBy: [
      { category: 'asc' },
      { order: 'asc' },
      { name: 'asc' },
    ],
  });
}

export async function getTechnologiesByCategory(category: string): Promise<Technology[]> {
  return await prisma.technology.findMany({
    where: { category },
    orderBy: [
      { order: 'asc' },
      { name: 'asc' },
    ],
  });
}

export async function getTechnologyById(id: string): Promise<Technology | null> {
  return await prisma.technology.findUnique({
    where: { id },
  });
}

export async function createTechnology(data: {
  name: string;
  icon?: string;
  category: string;
  order?: number;
}): Promise<Technology> {
  return await prisma.technology.create({
    data: {
      name: data.name,
      icon: data.icon,
      category: data.category,
      order: data.order ?? 0,
    },
  });
}

export async function updateTechnology(
  id: string,
  data: {
    name?: string;
    icon?: string;
    category?: string;
    order?: number;
  }
): Promise<Technology> {
  return await prisma.technology.update({
    where: { id },
    data,
  });
}

export async function deleteTechnology(id: string): Promise<Technology> {
  return await prisma.technology.delete({
    where: { id },
  });
}
