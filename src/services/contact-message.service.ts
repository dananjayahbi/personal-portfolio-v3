import { prisma } from "@/lib/prisma";
import { cache } from "react";

export interface CreateContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

/**
 * Create a new contact message
 */
export const createContactMessage = async (data: CreateContactMessageInput) => {
  return await prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      subject: data.subject || "",
      message: data.message,
    },
  });
};

/**
 * Get all contact messages with filtering options
 */
export const getAllContactMessages = cache(async (filterRead?: boolean) => {
  const where = filterRead !== undefined ? { read: filterRead } : {};
  
  return await prisma.contactMessage.findMany({
    where,
    orderBy: [
      { read: "asc" },
      { createdAt: "desc" },
    ],
  });
});

/**
 * Get a single contact message by ID
 */
export const getContactMessageById = cache(async (id: string) => {
  return await prisma.contactMessage.findUnique({
    where: { id },
  });
});

/**
 * Mark a contact message as read
 */
export const markMessageAsRead = async (id: string, read: boolean = true) => {
  return await prisma.contactMessage.update({
    where: { id },
    data: { read },
  });
};

/**
 * Delete a contact message
 */
export const deleteContactMessage = async (id: string) => {
  return await prisma.contactMessage.delete({
    where: { id },
  });
};

/**
 * Get count of unread messages
 */
export const getUnreadCount = cache(async () => {
  return await prisma.contactMessage.count({
    where: { read: false },
  });
});
