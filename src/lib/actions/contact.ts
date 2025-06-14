"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { TestimonialContentSchema } from "@/lib/schemas/contact";

import { Resend } from "resend";
import { auth } from "../auth";

const resend = new Resend(process.env.RESEND_API_KEY as string);

// Helper function to reduce duplication
async function createContactMessage(
  type:
    | "TESTIMONIAL"
    | "COMPLAINT"
    | "SUPPORT"
    | "FEEDBACK"
    | "GENERAL_INQUIRY",
  requiresAuth: boolean = false
) {
  const session = await auth();

  if (requiresAuth && !session) {
    throw new Error("Please log in to submit this type of message");
  }

  const contactMessage = await prisma.contactMessage.create({
    data: {
      type,
      authorId: session?.user?.id || null,
      guestEmail: session?.user ? null : undefined, // Will be set by individual functions
    },
  });

  return { contactMessage, user: session?.user || null };
}

export async function sendTestimonialMessage(
  values: z.infer<typeof TestimonialContentSchema>
) {
  const { contactMessage, user } = await createContactMessage(
    "TESTIMONIAL",
    true
  );

  await prisma.testimonialContent.create({
    data: {
      contactMessageId: contactMessage.id,
      rating: values.rating,
      content: values.content,
    },
  });

  // Send notification email
  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["marketing@bluefrog.com"],
      subject: "New Testimonial Received",
      text: `New testimonial from ${user!.firstName} ${user!.lastName}:\nRating: ${values.rating}\nContent: ${values.content}`,
    })
    .catch(console.error);
}
