/*
  Warnings:

  - You are about to drop the column `url` on the `MediaContent` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "MediaUrl" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "mediaContentId" TEXT NOT NULL,
    CONSTRAINT "MediaUrl_mediaContentId_fkey" FOREIGN KEY ("mediaContentId") REFERENCES "MediaContent" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MediaFile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "userMessageId" TEXT NOT NULL,
    CONSTRAINT "MediaFile_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MediaContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "messageId" TEXT NOT NULL,
    "userMessageId" TEXT NOT NULL,
    CONSTRAINT "MediaContent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MediaContent_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MediaContent" ("id", "messageId", "userMessageId") SELECT "id", "messageId", "userMessageId" FROM "MediaContent";
DROP TABLE "MediaContent";
ALTER TABLE "new_MediaContent" RENAME TO "MediaContent";
CREATE UNIQUE INDEX "MediaContent_messageId_key" ON "MediaContent"("messageId");
CREATE UNIQUE INDEX "MediaContent_userMessageId_key" ON "MediaContent"("userMessageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
