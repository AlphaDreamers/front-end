-- CreateTable
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "language" TEXT NOT NULL DEFAULT 'en_US',
    "ordersEnabled" BOOLEAN NOT NULL DEFAULT true,
    "ordersEmail" BOOLEAN NOT NULL DEFAULT true,
    "ordersInApp" BOOLEAN NOT NULL DEFAULT true,
    "messagesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "messagesEmail" BOOLEAN NOT NULL DEFAULT true,
    "messagesInApp" BOOLEAN NOT NULL DEFAULT true,
    "reviewsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "reviewsEmail" BOOLEAN NOT NULL DEFAULT false,
    "reviewsInApp" BOOLEAN NOT NULL DEFAULT true,
    "quietHoursEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursStartTime" TEXT,
    "quietHoursEndTime" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
