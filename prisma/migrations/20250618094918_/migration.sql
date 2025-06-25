/*
  Warnings:

  - The values [REFUND,COMPLAINT] on the enum `ContactMessageType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `userId` on the `CertificateRequestMessage` table. All the data in the column will be lost.
  - The `status` column on the `ContactMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `description` on the `TestimonialMessage` table. All the data in the column will be lost.
  - You are about to drop the `ComplaintMessage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RefundMessage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `message` to the `TestimonialMessage` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContactMessageStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'APPROVED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "ContactMessageType_new" AS ENUM ('TESTIMONIAL', 'BUG_REPORT', 'CERTIFICATE_REQUEST', 'SUPPORT_REQUEST', 'FEEDBACK');
ALTER TABLE "ContactMessage" ALTER COLUMN "type" TYPE "ContactMessageType_new" USING ("type"::text::"ContactMessageType_new");
ALTER TYPE "ContactMessageType" RENAME TO "ContactMessageType_old";
ALTER TYPE "ContactMessageType_new" RENAME TO "ContactMessageType";
DROP TYPE "ContactMessageType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "CertificateRequestMessage" DROP CONSTRAINT "CertificateRequestMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "ComplaintMessage" DROP CONSTRAINT "ComplaintMessage_contactMessageId_fkey";

-- DropForeignKey
ALTER TABLE "RefundMessage" DROP CONSTRAINT "RefundMessage_contactMessageId_fkey";

-- DropIndex
DROP INDEX "CertificateRequestMessage_applyingForId_idx";

-- DropIndex
DROP INDEX "ContactMessage_authorId_idx";

-- DropIndex
DROP INDEX "ContactMessage_type_status_idx";

-- AlterTable
ALTER TABLE "CertificateRequestMessage" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "ContactMessage" ALTER COLUMN "updatedAt" DROP DEFAULT,
DROP COLUMN "status",
ADD COLUMN     "status" "ContactMessageStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "TestimonialMessage" DROP COLUMN "description",
ADD COLUMN     "message" TEXT NOT NULL;

-- DropTable
DROP TABLE "ComplaintMessage";

-- DropTable
DROP TABLE "RefundMessage";

-- DropEnum
DROP TYPE "ComplaintStatus";

-- DropEnum
DROP TYPE "FeedbackCategory";

-- DropEnum
DROP TYPE "Status";

-- DropEnum
DROP TYPE "SupportPriority";

-- DropEnum
DROP TYPE "SupportStatus";
