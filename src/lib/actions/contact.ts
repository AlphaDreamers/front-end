"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ContactFormSchema, type ContactFormData } from "@/lib/schemas/contact";
import { me } from "./auth";

/**
 * Submits a contact message to the database
 *
 * This function demonstrates the power of discriminated unions - instead of
 * having separate functions for each message type, we have one intelligent
 * function that adapts based on the data shape.
 *
 * Think of it like a smart factory that can produce different products
 * based on the blueprint it receives.
 */
export async function submitContactMessage(values: ContactFormData) {
  try {
    // 1. Validate the incoming data using our robust schema
    // This catches malformed data before it reaches the database
    const validatedData = ContactFormSchema.parse(values);

    // 2. Get the current user (if any)
    const user = await me();

    // 3. Handle authentication requirements
    // Some message types require authentication, others allow guest submissions
    const requiresAuth =
      validatedData.type === "TESTIMONIAL" ||
      validatedData.type === "COMPLAINT";

    if (requiresAuth && !user) {
      throw new Error(
        `Authentication required for ${validatedData.type.toLowerCase()} submissions`
      );
    }

    // 4. Validate guest email requirement
    // If user is not authenticated, they must provide an email for non-auth-required types
    if (!user && !validatedData.guestEmail) {
      throw new Error("Email is required for guest submissions");
    }

    // 5. Create the contact message and related content in a transaction
    // This ensures data consistency - if any part fails, everything rolls back
    const result = await prisma.$transaction(async (tx) => {
      // First, create the main contact message record
      const contactMessage = await tx.contactMessage.create({
        data: {
          type: validatedData.type,
          authorId: user?.id || null,
          guestEmail: user ? null : validatedData.guestEmail,
        },
      });

      // Then create the type-specific content record
      // This is where the discriminated union really shines - TypeScript
      // knows exactly which properties are available for each type
      await createTypeSpecificContent(tx, contactMessage.id, validatedData);

      // Return the complete message with related data
      return await tx.contactMessage.findUnique({
        where: { id: contactMessage.id },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          testimonialContent: true,
          complaintContent: true,
          supportContent: true,
          feedbackContent: true,
          generalContent: true,
        },
      });
    });

    // 6. Optional: Send notification emails to admin team
    // This is where you might integrate with email services like Resend
    await sendNotificationEmail(validatedData.type, result);

    return { success: true, data: result };
  } catch (error) {
    console.error("Error submitting contact message:", error);

    // Provide user-friendly error messages while logging technical details
    const message =
      error instanceof z.ZodError
        ? "Please check your form data and try again"
        : error instanceof Error
          ? error.message
          : "Failed to submit message. Please try again.";

    throw new Error(message);
  }
}

/**
 * Creates type-specific content records based on the message type
 *
 * This function is like a specialized factory worker - it knows how to
 * create different types of products based on the specifications given.
 *
 * The beauty of the discriminated union is that TypeScript ensures we
 * handle all possible cases and access only the properties that exist
 * for each specific type.
 */
async function createTypeSpecificContent(
  tx: any, // Prisma transaction client
  contactMessageId: string,
  data: ContactFormData
) {
  // TypeScript's discriminated union ensures this switch is exhaustive
  // If we add a new message type, TypeScript will force us to handle it here
  switch (data.type) {
    case "TESTIMONIAL":
      // TypeScript knows data.rating and data.content exist here
      return await tx.testimonialContent.create({
        data: {
          contactMessageId,
          rating: data.rating,
          content: data.content,
        },
      });

    case "COMPLAINT":
      // TypeScript knows data.orderId and data.description exist here
      return await tx.complaintContent.create({
        data: {
          contactMessageId,
          orderId: data.orderId,
          description: data.description,
          status: "PENDING", // Default status for new complaints
        },
      });

    case "SUPPORT":
      // TypeScript knows all support-specific fields exist here
      return await tx.supportContent.create({
        data: {
          contactMessageId,
          subject: data.subject,
          description: data.description,
          priority: data.priority || "NORMAL",
          status: "OPEN", // Default status for new support requests
        },
      });

    case "FEEDBACK":
      // TypeScript knows feedback-specific fields exist here
      return await tx.feedbackContent.create({
        data: {
          contactMessageId,
          message: data.message,
          category: data.category || "GENERAL",
        },
      });

    case "GENERAL_INQUIRY":
      // TypeScript knows general inquiry fields exist here
      return await tx.generalContent.create({
        data: {
          contactMessageId,
          subject: data.subject || null,
          message: data.message,
        },
      });

    default:
      // TypeScript ensures this case is never reached
      // If we add a new type and forget to handle it, we get a compile error
      const exhaustiveCheck: never = data;
      throw new Error(`Unhandled message type: ${exhaustiveCheck}`);
  }
}

/**
 * Sends notification emails to the admin team based on message type
 *
 * Different message types might need different handling:
 * - Complaints might go to customer service
 * - Testimonials might go to marketing
 * - Support requests might go to technical support
 */
async function sendNotificationEmail(
  type: ContactFormData["type"],
  message: any
) {
  try {
    // This is where you would integrate with your email service
    // For example, using Resend (which you already have in your auth actions)

    const emailConfig = getEmailConfigForType(type);

    // Example email sending logic (uncomment when ready to implement)
    /*
    const { error } = await resend.emails.send({
      from: "BlueFrog <notifications@bluefrog.com>",
      to: emailConfig.recipients,
      subject: emailConfig.subject,
      text: formatEmailContent(type, message),
    });
    
    if (error) {
      console.error("Failed to send notification email:", error);
      // Don't throw here - we don't want email failures to break form submission
    }
    */

    console.log(
      `Would send ${type} notification to: ${emailConfig.recipients.join(", ")}`
    );
  } catch (error) {
    console.error("Error sending notification email:", error);
    // Log the error but don't throw - email failures shouldn't break the submission
  }
}

/**
 * Configuration for email notifications based on message type
 * This allows different teams to receive different types of messages
 */
function getEmailConfigForType(type: ContactFormData["type"]) {
  const configs = {
    TESTIMONIAL: {
      recipients: ["marketing@bluefrog.com", "success@bluefrog.com"],
      subject: "New Customer Testimonial Received",
    },
    COMPLAINT: {
      recipients: ["support@bluefrog.com", "manager@bluefrog.com"],
      subject: "Customer Complaint Requires Attention",
    },
    SUPPORT: {
      recipients: ["support@bluefrog.com"],
      subject: "New Support Request",
    },
    FEEDBACK: {
      recipients: ["product@bluefrog.com", "feedback@bluefrog.com"],
      subject: "Product Feedback Received",
    },
    GENERAL_INQUIRY: {
      recipients: ["info@bluefrog.com"],
      subject: "General Inquiry Received",
    },
  };

  return configs[type];
}

/**
 * Helper function to get contact messages for admin dashboard
 * This shows how you might query the contact messages later
 */
export async function getContactMessages(
  options: {
    type?: ContactFormData["type"];
    status?: string;
    limit?: number;
    offset?: number;
  } = {}
) {
  const { type, status, limit = 50, offset = 0 } = options;

  return await prisma.contactMessage.findMany({
    where: {
      ...(type && { type }),
      // Status filtering would depend on the specific content type
      // This is a simplified example
    },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      testimonialContent: true,
      complaintContent: true,
      supportContent: true,
      feedbackContent: true,
      generalContent: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
  });
}

/**
 * Helper function to update the status of support requests or complaints
 * This would be used in an admin dashboard
 */
export async function updateContactMessageStatus(
  messageId: string,
  status: string,
  adminNote?: string
) {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: messageId },
      select: { type: true },
    });

    if (!message) {
      throw new Error("Message not found");
    }

    // Update status based on message type
    if (message.type === "SUPPORT") {
      await prisma.supportContent.updateMany({
        where: { contactMessageId: messageId },
        data: { status },
      });
    } else if (message.type === "COMPLAINT") {
      await prisma.complaintContent.updateMany({
        where: { contactMessageId: messageId },
        data: { status },
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating message status:", error);
    throw new Error("Failed to update message status");
  }
}
