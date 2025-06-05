/*
  Warnings:

  - You are about to drop the `ReviewResponse` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReviewResponse" DROP CONSTRAINT "ReviewResponse_authorId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewResponse" DROP CONSTRAINT "ReviewResponse_reviewId_fkey";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "sellerRespondedAt" TIMESTAMP(3),
ADD COLUMN     "sellerResponse" TEXT;

-- DropTable
DROP TABLE "ReviewResponse";

-- CreateIndex
CREATE INDEX "Review_gigId_createdAt_idx" ON "Review"("gigId", "createdAt");

-- CreateIndex
CREATE INDEX "Review_sellerResponse_idx" ON "Review"("sellerResponse");
