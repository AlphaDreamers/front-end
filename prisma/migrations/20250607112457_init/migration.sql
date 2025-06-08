/*
  Warnings:

  - You are about to drop the column `locationCountryCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Language` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_LanguageToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_locationCountryCode_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageToUser" DROP CONSTRAINT "_LanguageToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_LanguageToUser" DROP CONSTRAINT "_LanguageToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "locationCountryCode",
ADD COLUMN     "country" TEXT NOT NULL DEFAULT 'US',
ADD COLUMN     "languages" TEXT[];

-- DropTable
DROP TABLE "Country";

-- DropTable
DROP TABLE "Language";

-- DropTable
DROP TABLE "_LanguageToUser";
