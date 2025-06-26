"use server";

import { Resend } from "resend";
import { prisma } from "../prisma";
import WelcomeEmailTemplate from "@/components/email-templates/welcome-email";
import OrderDeliveryNotification from "@/components/email-templates/order-delivery";
import PasswordResetEmailTemplate from "@/components/email-templates/password-reset";
import PasswordChangedEmailTemplate from "@/components/email-templates/password-changed";
import TransactionConfirmationBuyer from "@/components/email-templates/transaction-confirmation-buyer";
import TransactionConfirmationSeller from "@/components/email-templates/transaction-confirmation-seller";
import RevisionRequest from "@/components/email-templates/revision-request";
import VerificationEmail from "@/components/email-templates/email-verification";
import { ComponentProps } from "react";

const emailTemplates = {
  welcome: WelcomeEmailTemplate,
  passwordReset: PasswordResetEmailTemplate,
  passwordChanged: PasswordChangedEmailTemplate,
  buyerTransaction: TransactionConfirmationBuyer,
  sellerTransaction: TransactionConfirmationSeller,
  orderDelivered: OrderDeliveryNotification,
  revisionRequested: RevisionRequest,
  verify: VerificationEmail,
};

const emailSubjects: Record<keyof typeof emailTemplates, string> = {
  welcome: "Welcome to Acme! Verify your email",
  passwordReset: "Reset your password",
  passwordChanged: "Your password has been changed",
  buyerTransaction: "Your order has been placed",
  sellerTransaction: "You received a new order",
  orderDelivered: "Order has been marked as delivered",
  revisionRequested: "Revision requested on your delivery",
  verify: "Verify your email address",
};

const resend = new Resend(process.env.RESEND_API_KEY);
const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL as string;

export async function sendEmail<T extends keyof typeof emailTemplates>(
  email: string,
  type: T,
  args: ComponentProps<(typeof emailTemplates)[T]>,
  recipientId?: string
): Promise<void> {
  console.log(email);
  if (recipientId) {
    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: recipientId },
    });
    const now = new Date();
    const userTime = new Date(
      now.toLocaleString("en-US", { timeZone: preferences?.timezone || "UTC" })
    );
    const currentMinutes = userTime.getHours() * 60 + userTime.getMinutes();

    let isOutsideQuietHours = true;

    if (
      preferences?.quietHoursEnabled &&
      preferences.quietHoursStartTime &&
      preferences.quietHoursEndTime
    ) {
      const [startH, startM] = preferences.quietHoursStartTime
        .split(":")
        .map(Number);
      const [endH, endM] = preferences.quietHoursEndTime.split(":").map(Number);
      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;

      if (startMinutes < endMinutes) {
        // Quiet hours same day (e.g., 22:00 to 08:00 is invalid in this format)
        isOutsideQuietHours = !(
          currentMinutes >= startMinutes && currentMinutes < endMinutes
        );
      } else {
        // Quiet hours span midnight (e.g., 22:00 to 08:00)
        isOutsideQuietHours =
          currentMinutes >= endMinutes && currentMinutes < startMinutes;
      }
    }

    const isEmailEnabled = (() => {
      switch (type) {
        case "orderDelivered":
        case "revisionRequested":
          return preferences?.ordersEnabled && preferences.ordersEmail;
        default:
          return true;
      }
    })();

    if (isEmailEnabled && isOutsideQuietHours) {
      const templateFn = emailTemplates[type];
      const subject = emailSubjects[type];

      const { error } = await resend.emails.send({
        from: DEFAULT_FROM_EMAIL,
        to: [email],
        subject,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        react: await templateFn(args as any),
      });

      if (error) {
        throw new Error(
          `We couldn't send the "${type}" email. Please try again later.`
        );
      }
    }
  } else {
    const templateFn = emailTemplates[type];
    const subject = emailSubjects[type];

    const { error } = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to: [email],
      subject,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      react: await templateFn(args as any),
    });

    if (error) {
      throw new Error(
        `We couldn't send the "${type}" email. Please try again later.`
      );
    }
  }
}
