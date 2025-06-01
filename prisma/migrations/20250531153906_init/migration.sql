/*
  Warnings:

  - A unique constraint covering the columns `[publicKey]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `publicKey` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "publicKey" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_publicKey_key" ON "Wallet"("publicKey");
