/*
  Warnings:

  - You are about to drop the column `senderId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `userMessageId` to the `FileContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userMessageId` to the `ImageContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userMessageId` to the `LinkContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userMessageId` to the `PaymentContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userMessageId` to the `TextContent` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "UserMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "textMessageId" TEXT,
    "fileMessageId" TEXT,
    "imageMessageId" TEXT,
    "linkMessageId" TEXT,
    "paymentMessageId" TEXT,
    CONSTRAINT "UserMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FileContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fileUrl" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userMessageId" TEXT NOT NULL,
    CONSTRAINT "FileContent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FileContent_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_FileContent" ("fileUrl", "id", "messageId") SELECT "fileUrl", "id", "messageId" FROM "FileContent";
DROP TABLE "FileContent";
ALTER TABLE "new_FileContent" RENAME TO "FileContent";
CREATE UNIQUE INDEX "FileContent_messageId_key" ON "FileContent"("messageId");
CREATE UNIQUE INDEX "FileContent_userMessageId_key" ON "FileContent"("userMessageId");
CREATE TABLE "new_ImageContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userMessageId" TEXT NOT NULL,
    CONSTRAINT "ImageContent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ImageContent_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ImageContent" ("id", "messageId", "url") SELECT "id", "messageId", "url" FROM "ImageContent";
DROP TABLE "ImageContent";
ALTER TABLE "new_ImageContent" RENAME TO "ImageContent";
CREATE UNIQUE INDEX "ImageContent_messageId_key" ON "ImageContent"("messageId");
CREATE UNIQUE INDEX "ImageContent_userMessageId_key" ON "ImageContent"("userMessageId");
CREATE TABLE "new_LinkContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userMessageId" TEXT NOT NULL,
    CONSTRAINT "LinkContent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LinkContent_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LinkContent" ("id", "messageId", "url") SELECT "id", "messageId", "url" FROM "LinkContent";
DROP TABLE "LinkContent";
ALTER TABLE "new_LinkContent" RENAME TO "LinkContent";
CREATE UNIQUE INDEX "LinkContent_messageId_key" ON "LinkContent"("messageId");
CREATE UNIQUE INDEX "LinkContent_userMessageId_key" ON "LinkContent"("userMessageId");
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "chatId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("chatId", "createdAt", "id", "isRead", "type") SELECT "chatId", "createdAt", "id", "isRead", "type" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
CREATE TABLE "new_PaymentContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "messageId" TEXT NOT NULL,
    "userMessageId" TEXT NOT NULL,
    CONSTRAINT "PaymentContent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PaymentContent_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PaymentContent" ("amount", "id", "messageId", "status") SELECT "amount", "id", "messageId", "status" FROM "PaymentContent";
DROP TABLE "PaymentContent";
ALTER TABLE "new_PaymentContent" RENAME TO "PaymentContent";
CREATE UNIQUE INDEX "PaymentContent_messageId_key" ON "PaymentContent"("messageId");
CREATE UNIQUE INDEX "PaymentContent_userMessageId_key" ON "PaymentContent"("userMessageId");
CREATE TABLE "new_TextContent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userMessageId" TEXT NOT NULL,
    CONSTRAINT "TextContent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "TextContent_userMessageId_fkey" FOREIGN KEY ("userMessageId") REFERENCES "UserMessage" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TextContent" ("id", "messageId", "text") SELECT "id", "messageId", "text" FROM "TextContent";
DROP TABLE "TextContent";
ALTER TABLE "new_TextContent" RENAME TO "TextContent";
CREATE UNIQUE INDEX "TextContent_messageId_key" ON "TextContent"("messageId");
CREATE UNIQUE INDEX "TextContent_userMessageId_key" ON "TextContent"("userMessageId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "UserMessage_textMessageId_key" ON "UserMessage"("textMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMessage_fileMessageId_key" ON "UserMessage"("fileMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMessage_imageMessageId_key" ON "UserMessage"("imageMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMessage_linkMessageId_key" ON "UserMessage"("linkMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "UserMessage_paymentMessageId_key" ON "UserMessage"("paymentMessageId");
