import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Feedback } from "@prisma/client";

export interface FeedbackFilters {
  name?: string;
  isAnonymous?: boolean;
  minRating?: number;
  maxRating?: number;
  sortBy?: "createdAt" | "rating";
  sortOrder?: "asc" | "desc";
  limit?: number;
  skip?: number;
}

export interface CreateFeedbackData {
  name?: string;
  isAnonymous: boolean;
  rating: number;
  feedback: string;
}

export const feedbackService = {
  /**
   * Get all feedback with optional filters
   */
  async getFeedback(filters: FeedbackFilters = {}): Promise<{
    data: Feedback[];
    total: number;
  }> {
    const {
      name,
      isAnonymous,
      minRating,
      maxRating,
      sortBy = "createdAt",
      sortOrder = "desc",
      limit = 50,
      skip = 0,
    } = filters;

    // Build where clause
    const where: Prisma.FeedbackWhereInput = {};

    if (name) {
      where.name = {
        contains: name,
        mode: "insensitive",
      };
    }

    if (typeof isAnonymous === "boolean") {
      where.isAnonymous = isAnonymous;
    }

    if (minRating !== undefined || maxRating !== undefined) {
      where.rating = {};
      if (minRating !== undefined) where.rating.gte = minRating;
      if (maxRating !== undefined) where.rating.lte = maxRating;
    }

    // Execute query
    const [data, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        take: limit,
        skip,
      }),
      prisma.feedback.count({ where }),
    ]);

    return { data, total };
  },

  /**
   * Get feedback by ID
   */
  async getFeedbackById(id: string): Promise<Feedback | null> {
    return prisma.feedback.findUnique({
      where: { id },
    });
  },

  /**
   * Create new feedback
   */
  async createFeedback(data: CreateFeedbackData): Promise<Feedback> {
    // Validate rating (must be 0.5 increments between 0.5 and 5)
    if (data.rating < 0.5 || data.rating > 5 || data.rating % 0.5 !== 0) {
      throw new Error("Rating must be between 0.5 and 5 in 0.5 increments");
    }

    // If anonymous, clear the name
    const feedbackData = {
      ...data,
      name: data.isAnonymous ? null : data.name || null,
    };

    return prisma.feedback.create({
      data: feedbackData,
    });
  },

  /**
   * Delete feedback by ID
   */
  async deleteFeedback(id: string): Promise<Feedback> {
    return prisma.feedback.delete({
      where: { id },
    });
  },

  /**
   * Toggle feedback disabled state
   */
  async toggleFeedbackDisabled(id: string): Promise<Feedback> {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new Error("Feedback not found");
    }

    return prisma.feedback.update({
      where: { id },
      data: {
        isDisabled: !feedback.isDisabled,
      },
    });
  },

  /**
   * Toggle feedback featured state
   */
  async toggleFeedbackFeatured(id: string): Promise<Feedback> {
    const feedback = await prisma.feedback.findUnique({
      where: { id },
    });

    if (!feedback) {
      throw new Error("Feedback not found");
    }

    return prisma.feedback.update({
      where: { id },
      data: {
        isFeatured: !feedback.isFeatured,
      },
    });
  },

  /**
   * Get all featured feedback (active only)
   */
  async getFeaturedFeedback(): Promise<Feedback[]> {
    return prisma.feedback.findMany({
      where: {
        isFeatured: true,
        isDisabled: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  /**
   * Get feedback statistics
   */
  async getFeedbackStats(): Promise<{
    total: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
    anonymousCount: number;
  }> {
    const allFeedback = await prisma.feedback.findMany({
      select: {
        rating: true,
        isAnonymous: true,
      },
    });

    const total = allFeedback.length;
    const averageRating =
      total > 0
        ? allFeedback.reduce((sum, f) => sum + f.rating, 0) / total
        : 0;

    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let anonymousCount = 0;

    allFeedback.forEach((f) => {
      ratingDistribution[f.rating]++;
      if (f.isAnonymous) anonymousCount++;
    });

    return {
      total,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
      anonymousCount,
    };
  },
};
