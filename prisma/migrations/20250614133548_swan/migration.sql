/*
  Warnings:

  - Added the required column `updatedAt` to the `Gig` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gig" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
