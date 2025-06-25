/*
  Warnings:

  - You are about to drop the column `order` on the `PortfolioItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MediaFile" ADD COLUMN     "order" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "PortfolioItem" DROP COLUMN "order";
