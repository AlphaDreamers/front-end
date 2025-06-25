/*
  Warnings:

  - Made the column `order` on table `MediaFile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order` on table `PortfolioItem` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "PortfolioItem" DROP CONSTRAINT "PortfolioItem_userId_fkey";

-- AlterTable
ALTER TABLE "MediaFile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "order" SET NOT NULL;

-- AlterTable
ALTER TABLE "PortfolioItem" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "order" SET NOT NULL;

-- CreateIndex
CREATE INDEX "MediaFile_type_idx" ON "MediaFile"("type");

-- CreateIndex
CREATE INDEX "PortfolioItem_userId_order_idx" ON "PortfolioItem"("userId", "order");

-- CreateIndex
CREATE INDEX "PortfolioItem_userId_isFeatured_idx" ON "PortfolioItem"("userId", "isFeatured");

-- AddForeignKey
ALTER TABLE "PortfolioItem" ADD CONSTRAINT "PortfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
