/*
  Warnings:

  - You are about to drop the column `createdAt` on the `FailedLoginAttempt` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `FailedLoginAttempt` table. All the data in the column will be lost.
  - Added the required column `email` to the `FailedLoginAttempt` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `FailedLoginAttempt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FailedLoginAttempt" DROP CONSTRAINT "FailedLoginAttempt_userId_fkey";

-- AlterTable
ALTER TABLE "FailedLoginAttempt" DROP COLUMN "createdAt",
DROP COLUMN "userId",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "reason" TEXT NOT NULL,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
