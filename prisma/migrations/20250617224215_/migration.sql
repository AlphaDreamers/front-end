/*
  Warnings:

  - The values [SUPPORT,GENERAL_INQUIRY,CERTIFICATE_SUBMISSION] on the enum `ContactMessageType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `CertificateSubmission` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ComplaintContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FeedbackContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GeneralContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SupportContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TestimonialContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('GENERAL', 'FEATURE_REQUEST', 'UI_UX');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "ContactMessageType_new" AS ENUM ('TESTIMONIAL', 'BUG_REPORT', 'REFUND', 'COMPLAINT', 'CERTIFICATE_REQUEST', 'SUPPORT_REQUEST', 'FEEDBACK');
ALTER TABLE "ContactMessage" ALTER COLUMN "type" TYPE "ContactMessageType_new" USING ("type"::text::"ContactMessageType_new");
ALTER TYPE "ContactMessageType" RENAME TO "ContactMessageType_old";
ALTER TYPE "ContactMessageType_new" RENAME TO "ContactMessageType";
DROP TYPE "ContactMessageType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CertificateSubmission" DROP CONSTRAINT "CertificateSubmission_applyingForId_fkey";

-- DropForeignKey
ALTER TABLE "CertificateSubmission" DROP CONSTRAINT "CertificateSubmission_userId_fkey";

-- DropForeignKey
ALTER TABLE "ComplaintContent" DROP CONSTRAINT "ComplaintContent_contactMessageId_fkey";

-- DropForeignKey
ALTER TABLE "FeedbackContent" DROP CONSTRAINT "FeedbackContent_contactMessageId_fkey";

-- DropForeignKey
ALTER TABLE "GeneralContent" DROP CONSTRAINT "GeneralContent_contactMessageId_fkey";

-- DropForeignKey
ALTER TABLE "SupportContent" DROP CONSTRAINT "SupportContent_contactMessageId_fkey";

-- DropForeignKey
ALTER TABLE "TestimonialContent" DROP CONSTRAINT "TestimonialContent_contactMessageId_fkey";

-- DropIndex
DROP INDEX "ContactMessage_authorId_createdAt_idx";

-- DropIndex
DROP INDEX "ContactMessage_type_createdAt_idx";

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "CertificateSubmission";

-- DropTable
DROP TABLE "ComplaintContent";

-- DropTable
DROP TABLE "FeedbackContent";

-- DropTable
DROP TABLE "GeneralContent";

-- DropTable
DROP TABLE "SupportContent";

-- DropTable
DROP TABLE "TestimonialContent";

-- CreateTable
CREATE TABLE "TestimonialMessage" (
    "contactMessageId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BugReportMessage" (
    "contactMessageId" TEXT NOT NULL,
    "stepsToReproduce" TEXT NOT NULL,
    "expectedBehavior" TEXT NOT NULL,
    "actualBehavior" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RefundMessage" (
    "contactMessageId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "explanation" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ComplaintMessage" (
    "contactMessageId" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CertificateRequestMessage" (
    "contactMessageId" TEXT NOT NULL,
    "applyingForId" TEXT NOT NULL,
    "certificateUrl" TEXT NOT NULL,
    "userId" TEXT
);

-- CreateTable
CREATE TABLE "SupportRequestMessage" (
    "contactMessageId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "FeedbackMessage" (
    "contactMessageId" TEXT NOT NULL,
    "feedbackType" "FeedbackType" NOT NULL DEFAULT 'GENERAL',
    "message" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "TestimonialMessage_contactMessageId_key" ON "TestimonialMessage"("contactMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "BugReportMessage_contactMessageId_key" ON "BugReportMessage"("contactMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "RefundMessage_contactMessageId_key" ON "RefundMessage"("contactMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintMessage_contactMessageId_key" ON "ComplaintMessage"("contactMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateRequestMessage_contactMessageId_key" ON "CertificateRequestMessage"("contactMessageId");

-- CreateIndex
CREATE INDEX "CertificateRequestMessage_applyingForId_idx" ON "CertificateRequestMessage"("applyingForId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportRequestMessage_contactMessageId_key" ON "SupportRequestMessage"("contactMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackMessage_contactMessageId_key" ON "FeedbackMessage"("contactMessageId");

-- CreateIndex
CREATE INDEX "ContactMessage_type_status_idx" ON "ContactMessage"("type", "status");

-- CreateIndex
CREATE INDEX "ContactMessage_authorId_idx" ON "ContactMessage"("authorId");

-- AddForeignKey
ALTER TABLE "TestimonialMessage" ADD CONSTRAINT "TestimonialMessage_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BugReportMessage" ADD CONSTRAINT "BugReportMessage_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundMessage" ADD CONSTRAINT "RefundMessage_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintMessage" ADD CONSTRAINT "ComplaintMessage_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequestMessage" ADD CONSTRAINT "CertificateRequestMessage_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequestMessage" ADD CONSTRAINT "CertificateRequestMessage_applyingForId_fkey" FOREIGN KEY ("applyingForId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateRequestMessage" ADD CONSTRAINT "CertificateRequestMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportRequestMessage" ADD CONSTRAINT "SupportRequestMessage_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackMessage" ADD CONSTRAINT "FeedbackMessage_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
