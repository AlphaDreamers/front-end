/*
  Warnings:

  - Added the required column `description` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Badge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "conditionMetric" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Badge" ("color", "conditionMetric", "createdAt", "icon", "id", "label", "updatedAt") SELECT "color", "conditionMetric", "createdAt", "icon", "id", "label", "updatedAt" FROM "Badge";
DROP TABLE "Badge";
ALTER TABLE "new_Badge" RENAME TO "Badge";
CREATE UNIQUE INDEX "Badge_label_key" ON "Badge"("label");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
