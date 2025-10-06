import prisma from "@/lib/prisma";
import { cache } from "react";

export const getPortfolioContent = cache(async () => {
  const content = await prisma.portfolioContent.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return content;
});

export const getSiteSettings = cache(async () => {
  const settings = await prisma.siteSettings.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return settings;
});
