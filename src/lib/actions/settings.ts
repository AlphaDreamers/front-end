"use server";

import { z } from "zod";

import { SettingsFormSchema } from "../schemas/settings";
import { prisma } from "../prisma";
import { UserSettings } from "../types";
import { auth } from "../auth";

export const getSettings = async (): Promise<UserSettings> => {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }
  return prisma.userPreferences.findUniqueOrThrow({
    where: { userId: session.user.id },
    select: {
      timezone: true,
      language: true,
      ordersEnabled: true,
      ordersEmail: true,
      ordersInApp: true,
      messagesEnabled: true,
      messagesEmail: true,
      messagesInApp: true,
      reviewsEnabled: true,
      reviewsEmail: true,
      reviewsInApp: true,
      quietHoursEnabled: true,
      quietHoursStartTime: true,
      quietHoursEndTime: true,
    },
  });
};

export const updateSettings = async (
  values: z.infer<typeof SettingsFormSchema>
) => {
  const session = await auth();
  if (!session) {
    throw new Error("User not authenticated");
  }

  await prisma.userPreferences.update({
    where: { userId: session.user.id },
    data: values,
  });
};
