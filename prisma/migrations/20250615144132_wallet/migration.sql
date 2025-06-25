/*
  Warnings:

  - Made the column `gigId` on table `Review` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_gigId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiverPublicKey_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_senderPublicKey_fkey";

-- DropIndex
DROP INDEX "Transaction_orderId_idx";

-- DropIndex
DROP INDEX "Transaction_txId_idx";

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "gigId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderPublicKey_fkey" FOREIGN KEY ("senderPublicKey") REFERENCES "Wallet"("publicKey") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverPublicKey_fkey" FOREIGN KEY ("receiverPublicKey") REFERENCES "Wallet"("publicKey") ON DELETE CASCADE ON UPDATE CASCADE;
