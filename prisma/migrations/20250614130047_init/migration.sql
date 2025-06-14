/*
  Warnings:

  - You are about to drop the column `description` on the `Notification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Gig" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "description";
