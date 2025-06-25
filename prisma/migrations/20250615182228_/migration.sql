/*
  Warnings:

  - The values [GENERAL,UI_UX] on the enum `FeedbackCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "FeedbackCategory_new" AS ENUM ('BUG_REPORT', 'FEATURE_REQUEST', 'USER_EXPERIENCE', 'GENERAL_FEEDBACK');
ALTER TABLE "FeedbackContent" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "FeedbackContent" ALTER COLUMN "category" TYPE "FeedbackCategory_new" USING ("category"::text::"FeedbackCategory_new");
ALTER TYPE "FeedbackCategory" RENAME TO "FeedbackCategory_old";
ALTER TYPE "FeedbackCategory_new" RENAME TO "FeedbackCategory";
DROP TYPE "FeedbackCategory_old";
ALTER TABLE "FeedbackContent" ALTER COLUMN "category" SET DEFAULT 'GENERAL_FEEDBACK';
COMMIT;

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_portfolioItemId_fkey";

-- AlterTable
ALTER TABLE "FeedbackContent" ALTER COLUMN "category" SET DEFAULT 'GENERAL_FEEDBACK';

-- CreateTable
CREATE TABLE "_MediaFileToPortfolioItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaFileToPortfolioItem_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MediaFileToPortfolioItem_B_index" ON "_MediaFileToPortfolioItem"("B");

-- AddForeignKey
ALTER TABLE "_MediaFileToPortfolioItem" ADD CONSTRAINT "_MediaFileToPortfolioItem_A_fkey" FOREIGN KEY ("A") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaFileToPortfolioItem" ADD CONSTRAINT "_MediaFileToPortfolioItem_B_fkey" FOREIGN KEY ("B") REFERENCES "PortfolioItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
