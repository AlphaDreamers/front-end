-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('SOLANA', 'STRIPE');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'SOLANA',
ADD COLUMN     "stripePaymentIntent" TEXT;
