"use server";

import { z } from "zod";
import { SettingsFormSchema } from "../schemas/settings";
import { prisma } from "../prisma";
import { UserSettings } from "../types";
import { auth } from "../auth";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const getUserPreferences = async (): Promise<UserSettings> => {
  const session = await auth();
  if (!session) {
    throw new Error("You must be logged in to access preferences.");
  }

  const preferences = await prisma.userPreferences.findUnique({
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

  if (!preferences) {
    throw new Error("Preferences not found for user.");
  }

  return {
    timezone: preferences.timezone,
    language: preferences.language,
    ordersEnabled: preferences.ordersEnabled,
    ordersEmail: preferences.ordersEmail,
    ordersInApp: preferences.ordersInApp,
    messagesEnabled: preferences.messagesEnabled,
    messagesEmail: preferences.messagesEmail,
    messagesInApp: preferences.messagesInApp,
    reviewsEnabled: preferences.reviewsEnabled,
    reviewsEmail: preferences.reviewsEmail,
    reviewsInApp: preferences.reviewsInApp,
    quietHoursEnabled: preferences.quietHoursEnabled,
    quietHoursStartTime: preferences.quietHoursStartTime ?? undefined,
    quietHoursEndTime: preferences.quietHoursEndTime ?? undefined,
  };
};

export const updateUserPreferences = async (
  values: z.infer<typeof SettingsFormSchema>
): Promise<ActionResult<void>> => {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "You must be logged in to update preferences.",
      };
    }

    // Validate quiet hours logic
    if (
      values.quietHoursEnabled &&
      (!values.quietHoursStartTime || !values.quietHoursEndTime)
    ) {
      return {
        success: false,
        error: "Please set both start and end times for quiet hours.",
      };
    }

    await prisma.userPreferences.update({
      where: { userId: session.user.id },
      data: {
        ...values,
        quietHoursStartTime: values.quietHoursStartTime || null,
        quietHoursEndTime: values.quietHoursEndTime || null,
      },
    });

    return { success: true, data: undefined };
  } catch (error) {
    console.error("Update preferences error:", error);
    return {
      success: false,
      error: "Failed to update preferences. Please try again.",
    };
  }
};
