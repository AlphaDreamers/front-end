-- AlterEnum
ALTER TYPE "ContactMessageType" ADD VALUE 'CERTIFICATE_SUBMISSION';

-- CreateTable
CREATE TABLE "CertificateSubmission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "certificateUrl" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "applyingForId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificateSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CertificateSubmission_userId_status_idx" ON "CertificateSubmission"("userId", "status");

-- AddForeignKey
ALTER TABLE "CertificateSubmission" ADD CONSTRAINT "CertificateSubmission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificateSubmission" ADD CONSTRAINT "CertificateSubmission_applyingForId_fkey" FOREIGN KEY ("applyingForId") REFERENCES "Badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
