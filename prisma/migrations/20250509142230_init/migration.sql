/*
  Warnings:

  - You are about to drop the column `isActive` on the `Gig` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Gig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "averageRating" REAL NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "sellerId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Gig_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Gig_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Gig" ("averageRating", "categoryId", "createdAt", "description", "id", "ratingCount", "sellerId", "title", "updatedAt", "viewCount") SELECT "averageRating", "categoryId", "createdAt", "description", "id", "ratingCount", "sellerId", "title", "updatedAt", "viewCount" FROM "Gig";
DROP TABLE "Gig";
ALTER TABLE "new_Gig" RENAME TO "Gig";
CREATE INDEX "Gig_sellerId_idx" ON "Gig"("sellerId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
