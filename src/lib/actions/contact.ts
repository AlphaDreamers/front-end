"use server";
import { prisma } from "@/lib/prisma";
import {
  ContactMessageSchema,
  TestimonialSchema,
  BugReportSchema,
  CertificateRequestSchema,
  SupportRequestSchema,
  FeedbackSchema,
} from "@/lib/schemas/contact";
import { ContactMessageStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createContactMessage(
  data: z.infer<typeof ContactMessageSchema>
): Promise<ActionResult<undefined>> {
  return await prisma.$transaction(async (tx) => {
    const base = await tx.contactMessage.create({
      data: {
        type: data.type,
        guestEmail: data.guestEmail ?? null,
        status: ContactMessageStatus.PENDING,
      },
    });

    switch (data.type) {
      case "TESTIMONIAL": {
        const validated = TestimonialSchema.parse(data);
        await tx.testimonialMessage.create({
          data: {
            contactMessageId: base.id,
            rating: validated.rating,
            title: validated.title,
            message: validated.message,
          },
        });
        break;
      }
      case "BUG_REPORT": {
        const validated = BugReportSchema.parse(data);
        await tx.bugReportMessage.create({
          data: {
            contactMessageId: base.id,
            stepsToReproduce: validated.stepsToReproduce,
            expectedBehavior: validated.expectedBehavior,
            actualBehavior: validated.actualBehavior,
          },
        });
        break;
      }
      case "CERTIFICATE_REQUEST": {
        const validated = CertificateRequestSchema.parse(data);
        await tx.certificateRequestMessage.create({
          data: {
            contactMessageId: base.id,
            applyingForId: validated.applyingForId,
            certificateUrl: validated.certificateUrl,
          },
        });
        break;
      }
      case "SUPPORT_REQUEST": {
        const validated = SupportRequestSchema.parse(data);
        await tx.supportRequestMessage.create({
          data: {
            contactMessageId: base.id,
            subject: validated.subject,
            description: validated.description,
          },
        });
        break;
      }
      case "FEEDBACK": {
        const validated = FeedbackSchema.parse(data);
        await tx.feedbackMessage.create({
          data: {
            contactMessageId: base.id,
            feedbackType: validated.feedbackType,
            message: validated.message ?? null,
          },
        });
        break;
      }
      default:
        throw new Error("Unknown contact message type");
    }

    // Revalidate home page if it's a testimonial to show new testimonials immediately
    if (data.type === "TESTIMONIAL") {
      revalidatePath("/");
    }

    return { success: true, data: undefined };
  });
}
