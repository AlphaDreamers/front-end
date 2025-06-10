"use server";

import { z } from "zod";

import { SettingsFormSchema } from "../schemas/settings";
import { me } from "./auth";
import { prisma } from "../prisma";
import { UserSettings } from "../types";

export const getSettings = async (): Promise<UserSettings> => {
  const { user } = await me();
  if (!user) {
    throw new Error("User not authenticated");
  }
  return prisma.userPreferences.findUniqueOrThrow({
    where: { userId: user.id },
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
  const { user } = await me();
  if (!user) {
    throw new Error("User not authenticated");
  }

  await prisma.userPreferences.update({
    where: { userId: user.id },
    data: values,
  });
};
