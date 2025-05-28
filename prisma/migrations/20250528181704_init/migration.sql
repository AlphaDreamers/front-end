/*
  Warnings:

  - You are about to drop the `FileContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ImageContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LinkContent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaymentContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "FileContent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ImageContent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "LinkContent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "PaymentContent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "MediaContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userMessageId" TEXT NOT NULL,
    CONSTRAINT "MediaContent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MediaContent_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "MediaContent_messageId_key" ON "MediaContent"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaContent_userMessageId_key" ON "MediaContent"("userMessageId");
