-- CreateEnum
CREATE TYPE "FeedbackCategory" AS ENUM ('GENERAL', 'FEATURE_REQUEST', 'BUG_REPORT', 'UI_UX');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SupportPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ContactMessageType" ADD VALUE 'COMPLAINT';
ALTER TYPE "ContactMessageType" ADD VALUE 'SUPPORT';
ALTER TYPE "ContactMessageType" ADD VALUE 'FEEDBACK';
ALTER TYPE "ContactMessageType" ADD VALUE 'GENERAL_INQUIRY';

-- AlterTable
ALTER TABLE "ContactMessage" ADD COLUMN     "guestEmail" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "ComplaintContent" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactMessageId" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "ComplaintContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportContent" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contactMessageId" TEXT NOT NULL,
    "priority" "SupportPriority" NOT NULL DEFAULT 'NORMAL',
    "status" "SupportStatus" NOT NULL DEFAULT 'OPEN',

    CONSTRAINT "SupportContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackContent" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "category" "FeedbackCategory" NOT NULL DEFAULT 'GENERAL',
    "contactMessageId" TEXT NOT NULL,

    CONSTRAINT "FeedbackContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralContent" (
    "id" TEXT NOT NULL,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "contactMessageId" TEXT NOT NULL,

    CONSTRAINT "GeneralContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintContent_contactMessageId_key" ON "ComplaintContent"("contactMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "SupportContent_contactMessageId_key" ON "SupportContent"("contactMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackContent_contactMessageId_key" ON "FeedbackContent"("contactMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralContent_contactMessageId_key" ON "GeneralContent"("contactMessageId");

-- CreateIndex
CREATE INDEX "ContactMessage_type_createdAt_idx" ON "ContactMessage"("type", "createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_authorId_createdAt_idx" ON "ContactMessage"("authorId", "createdAt");

-- AddForeignKey
ALTER TABLE "ComplaintContent" ADD CONSTRAINT "ComplaintContent_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportContent" ADD CONSTRAINT "SupportContent_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackContent" ADD CONSTRAINT "FeedbackContent_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralContent" ADD CONSTRAINT "GeneralContent_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
