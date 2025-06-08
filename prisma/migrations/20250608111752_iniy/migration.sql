/*
  Warnings:

  - The primary key for the `Transaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Transaction` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `txId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_pkey",
DROP COLUMN "id",
ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "txId" TEXT NOT NULL,
ADD CONSTRAINT "Transaction_pkey" PRIMARY KEY ("txId");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_orderId_key" ON "Transaction"("orderId");

-- CreateIndex
CREATE INDEX "Transaction_txId_idx" ON "Transaction"("txId");

-- CreateIndex
CREATE INDEX "Transaction_orderId_idx" ON "Transaction"("orderId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
