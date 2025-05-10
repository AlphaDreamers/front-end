/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Biometrics` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Biometrics` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Biometrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Biometrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Biometrics" ("createdAt", "id", "updatedAt", "userId", "value") SELECT "createdAt", "id", "updatedAt", "userId", "value" FROM "Biometrics";
DROP TABLE "Biometrics";
ALTER TABLE "new_Biometrics" RENAME TO "Biometrics";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
