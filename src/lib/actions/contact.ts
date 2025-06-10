"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  ComplaintContentSchema,
  FeedbackContentSchema,
  GeneralContentSchema,
  SupportContentSchema,
  TestimonialContentSchema,
} from "@/lib/schemas/contact";
import { me } from "./auth";
import { Resend } from "resend";

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
  const {user,} = await me();

  if (requiresAuth && !user) {
    throw new Error("Please log in to submit this type of message");
  }

  const contactMessage = await prisma.contactMessage.create({
    data: {
      type,
      authorId: user?.id || null,
      guestEmail: user ? null : undefined, // Will be set by individual functions
    },
  });

  return { contactMessage, user };
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

export async function sendComplaintMessage(
  values: z.infer<typeof ComplaintContentSchema>
) {
  const { contactMessage, user } = await createContactMessage(
    "COMPLAINT",
    true
  );

  await prisma.complaintContent.create({
    data: {
      contactMessageId: contactMessage.id,
      orderId: values.orderId,
      description: values.description,
      status: "PENDING",
    },
  });

  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["support@bluefrog.com"],
      subject: "New Complaint Received",
      text: `New complaint from ${user!.firstName} ${user!.lastName}:\nOrder ID: ${values.orderId}\nDescription: ${values.description}`,
    })
    .catch(console.error);
}

export async function sendSupportMessage(
  values: z.infer<typeof SupportContentSchema>
) {
  const { contactMessage, user } = await createContactMessage("SUPPORT");

  // Update contact message with guest email if needed
  if (!user && values.guestEmail) {
    await prisma.contactMessage.update({
      where: { id: contactMessage.id },
      data: { guestEmail: values.guestEmail },
    });
  }

  await prisma.supportContent.create({
    data: {
      contactMessageId: contactMessage.id,
      subject: values.subject,
      description: values.description,
      priority: values.priority || "NORMAL",
      status: "OPEN",
    },
  });

  const sender = user
    ? `${user.firstName} ${user.lastName}`
    : `Guest (${values.guestEmail})`;

  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["support@bluefrog.com"],
      subject: "New Support Request",
      text: `New support request from ${sender}:\nSubject: ${values.subject}\nPriority: ${values.priority}\nDescription: ${values.description}`,
    })
    .catch(console.error);
}

export async function sendFeedbackMessage(
  values: z.infer<typeof FeedbackContentSchema>
) {
  const { contactMessage, user } = await createContactMessage("FEEDBACK");

  if (!user && values.guestEmail) {
    await prisma.contactMessage.update({
      where: { id: contactMessage.id },
      data: { guestEmail: values.guestEmail },
    });
  }

  await prisma.feedbackContent.create({
    data: {
      contactMessageId: contactMessage.id,
      message: values.message,
      category: values.category || "GENERAL",
    },
  });

  const sender = user
    ? `${user.firstName} ${user.lastName}`
    : `Guest (${values.guestEmail})`;

  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["feedback@bluefrog.com"],
      subject: "New Feedback Received",
      text: `New feedback from ${sender}:\nCategory: ${values.category}\nMessage: ${values.message}`,
    })
    .catch(console.error);
}

export async function sendGeneralInquiryMessage(
  values: z.infer<typeof GeneralContentSchema>
) {
  const { contactMessage, user } =
    await createContactMessage("GENERAL_INQUIRY");

  if (!user && values.guestEmail) {
    await prisma.contactMessage.update({
      where: { id: contactMessage.id },
      data: { guestEmail: values.guestEmail },
    });
  }

  await prisma.generalContent.create({
    data: {
      contactMessageId: contactMessage.id,
      subject: values.subject || null,
      message: values.message,
    },
  });

  const sender = user
    ? `${user.firstName} ${user.lastName}`
    : `Guest (${values.guestEmail})`;

  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["info@bluefrog.com"],
      subject: "New General Inquiry",
      text: `New inquiry from ${sender}:\nSubject: ${values.subject || "N/A"}\nMessage: ${values.message}`,
    })
    .catch(console.error);
}
