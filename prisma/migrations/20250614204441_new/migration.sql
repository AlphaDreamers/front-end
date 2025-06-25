/*
  Warnings:

  - The values [SYSTEM] on the enum `MessageType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `SystemContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "MessageType_new" AS ENUM ('TEXT', 'MEDIA');
ALTER TABLE "Message" ALTER COLUMN "type" TYPE "MessageType_new" USING ("type"::text::"MessageType_new");
ALTER TYPE "MessageType" RENAME TO "MessageType_old";
ALTER TYPE "MessageType_new" RENAME TO "MessageType";
DROP TYPE "MessageType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "SystemContent" DROP CONSTRAINT "SystemContent_messageId_fkey";

-- DropTable
DROP TABLE "SystemContent";

-- DropEnum
DROP TYPE "SystemContentType";
