/*
  Warnings:

  - You are about to drop the column `url` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `fileType` on the `MediaFile` table. All the data in the column will be lost.
  - You are about to drop the column `userMessageId` on the `MediaFile` table. All the data in the column will be lost.
  - You are about to drop the `MediaUrl` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileId` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `MediaFile` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'OTHER');

-- DropForeignKey
ALTER TABLE "MediaFile" DROP CONSTRAINT "MediaFile_userMessageId_fkey";

-- DropForeignKey
ALTER TABLE "MediaUrl" DROP CONSTRAINT "MediaUrl_mediaContentId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "url",
ADD COLUMN     "fileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MediaFile" DROP COLUMN "fileType",
DROP COLUMN "userMessageId",
ADD COLUMN     "type" "MediaType" NOT NULL;

-- DropTable
DROP TABLE "MediaUrl";

-- CreateTable
CREATE TABLE "_MediaContentToMediaFile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MediaContentToMediaFile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MediaContentToMediaFile_B_index" ON "_MediaContentToMediaFile"("B");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "MediaFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaContentToMediaFile" ADD CONSTRAINT "_MediaContentToMediaFile_A_fkey" FOREIGN KEY ("A") REFERENCES "MediaContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MediaContentToMediaFile" ADD CONSTRAINT "_MediaContentToMediaFile_B_fkey" FOREIGN KEY ("B") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
