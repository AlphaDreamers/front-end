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

export async function sendTestimonialMessage(
  values: z.infer<typeof TestimonialContentSchema>
) {
  const user = await me();

  if (!user) {
    throw new Error("Authentication required for testimonial submissions");
  }

  const result = await prisma.$transaction(async (tx) => {
    const contactMessage = await tx.contactMessage.create({
      data: {
        type: "TESTIMONIAL",
        authorId: user.id,
      },
    });

    await tx.testimonialContent.create({
      data: {
        contactMessageId: contactMessage.id,
        rating: values.rating,
        content: values.content,
      },
    });

    return await tx.contactMessage.findUnique({
      where: { id: contactMessage.id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        testimonialContent: true,
      },
    });
  });

  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["marketing@bluefrog.com"],
      subject: "New Testimonial Received",
      text: `New testimonial from ${user.firstName} ${user.lastName} (${user.email}):\nRating: ${values.rating}\nContent: ${values.content}`,
    })
    .catch(console.error);

  return { success: true, data: result };
}

export async function sendComplaintMessage(
  values: z.infer<typeof ComplaintContentSchema>
) {
  const user = await me();

  if (!user) {
    throw new Error("Authentication required for complaint submissions");
  }

  const result = await prisma.$transaction(async (tx) => {
    const contactMessage = await tx.contactMessage.create({
      data: {
        type: "COMPLAINT",
        authorId: user.id,
      },
    });

    await tx.complaintContent.create({
      data: {
        contactMessageId: contactMessage.id,
        orderId: values.orderId,
        description: values.description,
        status: "PENDING",
      },
    });

    return await tx.contactMessage.findUnique({
      where: { id: contactMessage.id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        complaintContent: true,
      },
    });
  });

  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["customerservice@bluefrog.com"],
      subject: "New Complaint Received",
      text: `New complaint from ${user.firstName} ${user.lastName} (${user.email}):\nOrder ID: ${values.orderId}\nDescription: ${values.description}`,
    })
    .catch(console.error);

  return { success: true, data: result };
}

export async function sendSupportMessage(
  values: z.infer<typeof SupportContentSchema>
) {
  const user = await me();

  if (!user && !values.guestEmail) {
    throw new Error("Email is required for guest submissions");
  }

  const result = await prisma.$transaction(async (tx) => {
    const contactMessage = await tx.contactMessage.create({
      data: {
        type: "SUPPORT",
        authorId: user?.id || null,
        guestEmail: user ? null : values.guestEmail,
      },
    });

    await tx.supportContent.create({
      data: {
        contactMessageId: contactMessage.id,
        subject: values.subject,
        description: values.description,
        priority: values.priority || "NORMAL",
        status: "OPEN",
      },
    });

    return await tx.contactMessage.findUnique({
      where: { id: contactMessage.id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        supportContent: true,
      },
    });
  });

  const sender = user
    ? `${user.firstName} ${user.lastName} (${user.email})`
    : `Guest (${values.guestEmail})`;
  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["support@bluefrog.com"],
      subject: "New Support Request",
      text: `New support request from ${sender}:\nSubject: ${values.subject}\nDescription: ${values.description}\nPriority: ${values.priority || "NORMAL"}`,
    })
    .catch(console.error);

  return { success: true, data: result };
}

export async function sendFeedbackMessage(
  values: z.infer<typeof FeedbackContentSchema>
) {
  const user = await me();

  const result = await prisma.$transaction(async (tx) => {
    const contactMessage = await tx.contactMessage.create({
      data: {
        type: "FEEDBACK",
        authorId: user?.id || null,
        guestEmail: user ? null : values.guestEmail,
      },
    });

    await tx.feedbackContent.create({
      data: {
        contactMessageId: contactMessage.id,
        message: values.message,
        category: values.category || "GENERAL",
      },
    });

    return await tx.contactMessage.findUnique({
      where: { id: contactMessage.id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        feedbackContent: true,
      },
    });
  });

  const sender = user
    ? `${user.firstName} ${user.lastName} (${user.email})`
    : `Guest (${values.guestEmail})`;
  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["feedback@bluefrog.com"],
      subject: "New Feedback Received",
      text: `New feedback from ${sender}:\nCategory: ${values.category || "GENERAL"}\nMessage: ${values.message}`,
    })
    .catch(console.error);

  return { success: true, data: result };
}

export async function sendGeneralInquiryMessage(
  values: z.infer<typeof GeneralContentSchema>
) {
  const user = await me();

  if (!user && !values.guestEmail) {
    throw new Error("Email is required for guest submissions");
  }

  const result = await prisma.$transaction(async (tx) => {
    const contactMessage = await tx.contactMessage.create({
      data: {
        type: "GENERAL_INQUIRY",
        authorId: user?.id || null,
        guestEmail: user ? null : values.guestEmail,
      },
    });

    await tx.generalContent.create({
      data: {
        contactMessageId: contactMessage.id,
        subject: values.subject || null,
        message: values.message,
      },
    });

    return await tx.contactMessage.findUnique({
      where: { id: contactMessage.id },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        generalContent: true,
      },
    });
  });

  const sender = user
    ? `${user.firstName} ${user.lastName} (${user.email})`
    : `Guest (${values.guestEmail})`;
  resend.emails
    .send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: ["info@bluefrog.com"],
      subject: "New General Inquiry",
      text: `New general inquiry from ${sender}:\nSubject: ${values.subject || "N/A"}\nMessage: ${values.message}`,
    })
    .catch(console.error);

  return { success: true, data: result };
}
