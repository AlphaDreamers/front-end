/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `publicKey` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Wallet` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `receiverPublicKey` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderPublicKey` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderId_fkey";

-- DropIndex
DROP INDEX "Wallet_publicKey_key";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "receiverId",
DROP COLUMN "senderId",
ADD COLUMN     "receiverPublicKey" TEXT NOT NULL,
ADD COLUMN     "senderPublicKey" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "publicKey";

-- AlterTable
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Wallet_pkey" PRIMARY KEY ("publicKey");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderPublicKey_fkey" FOREIGN KEY ("senderPublicKey") REFERENCES "Wallet"("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverPublicKey_fkey" FOREIGN KEY ("receiverPublicKey") REFERENCES "Wallet"("publicKey") ON DELETE RESTRICT ON UPDATE CASCADE;
