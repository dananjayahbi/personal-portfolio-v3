import { prisma } from "@/lib/prisma";
import { cache } from "react";

/**
 * Track a page view or increment visit count for existing visitor
 */
export const trackPageView = async (
  ip: string,
  userAgent?: string,
  country?: string,
  city?: string
) => {
  // Check if IP is in ignored list
  const ignored = await prisma.ignoredIP.findUnique({
    where: { ip },
  });

  if (ignored) {
    return null; // Don't track ignored IPs
  }

  // Check if visitor exists
  const existing = await prisma.pageView.findUnique({
    where: { ip },
  });

  if (existing) {
    // Increment visit count and update last visit
    return await prisma.pageView.update({
      where: { ip },
      data: {
        visits: { increment: 1 },
        lastVisit: new Date(),
        userAgent: userAgent || existing.userAgent,
        country: country || existing.country,
        city: city || existing.city,
      },
    });
  } else {
    // Create new visitor record
    return await prisma.pageView.create({
      data: {
        ip,
        userAgent,
        country,
        city,
        visits: 1,
      },
    });
  }
};

/**
 * Get all page views with stats
 */
export const getAllPageViews = cache(async () => {
  return await prisma.pageView.findMany({
    orderBy: { lastVisit: "desc" },
  });
});

/**
 * Get total views count (sum of all visits)
 */
export const getTotalViews = cache(async () => {
  const views = await prisma.pageView.findMany({
    select: { visits: true },
  });

  return views.reduce((sum, view) => sum + view.visits, 0);
});

/**
 * Get unique visitors count
 */
export const getUniqueVisitorsCount = cache(async () => {
  return await prisma.pageView.count();
});

/**
 * Delete a page view record
 */
export const deletePageView = async (id: string) => {
  return await prisma.pageView.delete({
    where: { id },
  });
};

/**
 * Get all ignored IPs
 */
export const getAllIgnoredIPs = cache(async () => {
  return await prisma.ignoredIP.findMany({
    orderBy: { createdAt: "desc" },
  });
});

/**
 * Add an IP to the ignored list and delete any existing page views for that IP
 */
export const addIgnoredIP = async (ip: string, description?: string) => {
  // Delete existing page views for this IP first
  await prisma.pageView.deleteMany({
    where: { ip },
  });

  // Then add to ignored list
  return await prisma.ignoredIP.create({
    data: {
      ip,
      description,
    },
  });
};

/**
 * Remove an IP from the ignored list
 */
export const removeIgnoredIP = async (id: string) => {
  return await prisma.ignoredIP.delete({
    where: { id },
  });
};

/**
 * Check if an IP is ignored
 */
export const isIPIgnored = cache(async (ip: string) => {
  const ignored = await prisma.ignoredIP.findUnique({
    where: { ip },
  });
  return !!ignored;
});
