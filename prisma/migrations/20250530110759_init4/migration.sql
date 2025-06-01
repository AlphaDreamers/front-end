/*
  Warnings:

  - You are about to drop the column `label` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `GigFeature` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `Skill` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `Tag` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `TestimonialContent` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `GigFeature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Skill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BadgeMilestone" DROP CONSTRAINT "BadgeMilestone_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ContactMessage" DROP CONSTRAINT "ContactMessage_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Gig" DROP CONSTRAINT "Gig_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "GigFaq" DROP CONSTRAINT "GigFaq_gigId_fkey";

-- DropForeignKey
ALTER TABLE "GigFeature" DROP CONSTRAINT "GigFeature_gigId_fkey";

-- DropForeignKey
ALTER TABLE "MediaContent" DROP CONSTRAINT "MediaContent_userMessageId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_chatId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_recipientId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_gigId_fkey";

-- DropForeignKey
ALTER TABLE "Package" DROP CONSTRAINT "Package_gigId_fkey";

-- DropForeignKey
ALTER TABLE "PackageFeature" DROP CONSTRAINT "PackageFeature_featureId_fkey";

-- DropForeignKey
ALTER TABLE "PackageFeature" DROP CONSTRAINT "PackageFeature_gigPackageId_fkey";

-- DropForeignKey
ALTER TABLE "PortfolioItem" DROP CONSTRAINT "PortfolioItem_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_gigId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_orderId_fkey";

-- DropForeignKey
ALTER TABLE "SocialLink" DROP CONSTRAINT "SocialLink_userId_fkey";

-- DropForeignKey
ALTER TABLE "TestimonialContent" DROP CONSTRAINT "TestimonialContent_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "TestimonialContent" DROP CONSTRAINT "TestimonialContent_contactMessageId_fkey";

-- DropForeignKey
ALTER TABLE "TextContent" DROP CONSTRAINT "TextContent_userMessageId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadgeProgress" DROP CONSTRAINT "UserBadgeProgress_badgeId_fkey";

-- DropForeignKey
ALTER TABLE "UserBadgeProgress" DROP CONSTRAINT "UserBadgeProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserMessage" DROP CONSTRAINT "UserMessage_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_skillId_fkey";

-- DropForeignKey
ALTER TABLE "UserSkill" DROP CONSTRAINT "UserSkill_userId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_userId_fkey";

-- DropIndex
DROP INDEX "Category_slug_key";

-- DropIndex
DROP INDEX "Tag_slug_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "label",
DROP COLUMN "slug",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ContactMessage" ALTER COLUMN "authorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GigFeature" DROP COLUMN "label",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "gigId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "authorId" DROP NOT NULL,
ALTER COLUMN "gigId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Skill" DROP COLUMN "label",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "label",
DROP COLUMN "slug",
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestimonialContent" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "UserMessage" ALTER COLUMN "userId" DROP NOT NULL;

-- DropEnum
DROP TYPE "PaymentStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Category_title_key" ON "Category"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_title_key" ON "Tag"("title");

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestimonialContent" ADD CONSTRAINT "TestimonialContent_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "ContactMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserMessage" ADD CONSTRAINT "UserMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationToken" ADD CONSTRAINT "VerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gig" ADD CONSTRAINT "Gig_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GigFeature" ADD CONSTRAINT "GigFeature_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageFeature" ADD CONSTRAINT "PackageFeature_gigPackageId_fkey" FOREIGN KEY ("gigPackageId") REFERENCES "Package"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackageFeature" ADD CONSTRAINT "PackageFeature_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "GigFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSkill" ADD CONSTRAINT "UserSkill_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TextContent" ADD CONSTRAINT "TextContent_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaContent" ADD CONSTRAINT "MediaContent_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BadgeMilestone" ADD CONSTRAINT "BadgeMilestone_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadgeProgress" ADD CONSTRAINT "UserBadgeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBadgeProgress" ADD CONSTRAINT "UserBadgeProgress_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GigFaq" ADD CONSTRAINT "GigFaq_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
