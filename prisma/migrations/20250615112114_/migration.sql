/*
  Warnings:

  - You are about to drop the column `gigId` on the `Review` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_gigId_fkey";

-- DropIndex
DROP INDEX "Review_gigId_createdAt_idx";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "gigId";
