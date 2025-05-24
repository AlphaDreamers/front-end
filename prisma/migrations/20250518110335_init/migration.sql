-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserBadgeProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "badgeId" TEXT NOT NULL,
    "currentProgress" INTEGER NOT NULL DEFAULT 0,
    "highestTier" TEXT NOT NULL DEFAULT 'NONE',
    CONSTRAINT "UserBadgeProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserBadgeProgress_badgeId_fkey" FOREIGN KEY ("badgeId") REFERENCES "Badge" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserBadgeProgress" ("badgeId", "currentProgress", "highestTier", "id", "userId") SELECT "badgeId", "currentProgress", "highestTier", "id", "userId" FROM "UserBadgeProgress";
DROP TABLE "UserBadgeProgress";
ALTER TABLE "new_UserBadgeProgress" RENAME TO "UserBadgeProgress";
CREATE UNIQUE INDEX "UserBadgeProgress_userId_badgeId_key" ON "UserBadgeProgress"("userId", "badgeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
