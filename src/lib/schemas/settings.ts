import { z } from "zod";

import { TIME_ZONES } from "../data/time-zones";
import { LANGUAGES } from "../data/languages";

export const SettingsFormSchema = z.object({
  timezone: z.enum(TIME_ZONES.map((tz) => tz.value) as [string, ...string[]], {
    required_error: "Timezone is required",
    invalid_type_error: "Timezone must be a valid timezone",
  }),
  language: z.enum(
    LANGUAGES.map((lang) => lang.code) as [string, ...string[]],
    {
      required_error: "Language is required",
      invalid_type_error: "Language must be a valid language",
    }
  ),
  ordersEnabled: z.boolean(),
  ordersEmail: z.boolean(),
  ordersInApp: z.boolean(),
  messagesEnabled: z.boolean(),
  messagesEmail: z.boolean(),
  messagesInApp: z.boolean(),
  reviewsEnabled: z.boolean(),
  reviewsEmail: z.boolean(),
  reviewsInApp: z.boolean(),
  quietHoursEnabled: z.boolean(),
  quietHoursStartTime: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true; // Allow null or undefined
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:MM format
        return timePattern.test(value);
      },
      {
        message: "Quiet hours start time must be in HH:MM format",
      }
    ),
  quietHoursEndTime: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true; // Allow null or undefined
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; // Matches HH:MM format
        return timePattern.test(value);
      },
      {
        message: "Quiet hours end time must be in HH:MM format",
      }
    ),
});
