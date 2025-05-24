-- CreateTable
CREATE TABLE "PorfolioItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "userId" TEXT NOT NULL,
    CONSTRAINT "PorfolioItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Image" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "gigId" TEXT,
    "portfolioItemId" TEXT,
    CONSTRAINT "Image_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Image_portfolioItemId_fkey" FOREIGN KEY ("portfolioItemId") REFERENCES "PorfolioItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Image" ("gigId", "id", "isPrimary", "url") SELECT "gigId", "id", "isPrimary", "url" FROM "Image";
DROP TABLE "Image";
ALTER TABLE "new_Image" RENAME TO "Image";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
