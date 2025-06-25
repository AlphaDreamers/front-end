/*
  Warnings:

  - You are about to drop the `Image` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_fileId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_gigId_fkey";

-- AlterTable
ALTER TABLE "PortfolioItem" ADD COLUMN     "order" INTEGER DEFAULT 0;

-- DropTable
DROP TABLE "Image";

-- CreateTable
CREATE TABLE "_GigToMediaFile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_GigToMediaFile_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GigToMediaFile_B_index" ON "_GigToMediaFile"("B");

-- AddForeignKey
ALTER TABLE "_GigToMediaFile" ADD CONSTRAINT "_GigToMediaFile_A_fkey" FOREIGN KEY ("A") REFERENCES "Gig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GigToMediaFile" ADD CONSTRAINT "_GigToMediaFile_B_fkey" FOREIGN KEY ("B") REFERENCES "MediaFile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
