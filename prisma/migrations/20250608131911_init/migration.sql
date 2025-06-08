/*
  Warnings:

  - You are about to drop the column `category` on the `FAQ` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `FAQ` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FAQ" DROP COLUMN "category",
DROP COLUMN "updatedAt";
