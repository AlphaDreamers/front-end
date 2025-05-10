/*
  Warnings:

  - You are about to drop the column `isActive` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `alt` on the `GigImage` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `GigPackage` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `GigPackageFeature` table. All the data in the column will be lost.
  - You are about to drop the column `endorsed` on the `user_skills` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "parentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Category" ("createdAt", "id", "label", "parentId", "slug", "updatedAt") SELECT "createdAt", "id", "label", "parentId", "slug", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_label_key" ON "Category"("label");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE TABLE "new_GigImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "gigId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GigImage_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GigImage" ("createdAt", "gigId", "id", "isPrimary", "sortOrder", "updatedAt", "url") SELECT "createdAt", "gigId", "id", "isPrimary", "sortOrder", "updatedAt", "url" FROM "GigImage";
DROP TABLE "GigImage";
ALTER TABLE "new_GigImage" RENAME TO "GigImage";
CREATE INDEX "GigImage_gigId_isPrimary_idx" ON "GigImage"("gigId", "isPrimary");
CREATE TABLE "new_GigPackage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "deliveryTime" INTEGER NOT NULL,
    "revisions" INTEGER NOT NULL DEFAULT 1,
    "gigId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GigPackage_gigId_fkey" FOREIGN KEY ("gigId") REFERENCES "Gig" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GigPackage" ("createdAt", "deliveryTime", "description", "gigId", "id", "price", "revisions", "title", "updatedAt") SELECT "createdAt", "deliveryTime", "description", "gigId", "id", "price", "revisions", "title", "updatedAt" FROM "GigPackage";
DROP TABLE "GigPackage";
ALTER TABLE "new_GigPackage" RENAME TO "GigPackage";
CREATE TABLE "new_GigPackageFeature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "included" BOOLEAN NOT NULL DEFAULT true,
    "gigPackageId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GigPackageFeature_gigPackageId_fkey" FOREIGN KEY ("gigPackageId") REFERENCES "GigPackage" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_GigPackageFeature" ("createdAt", "gigPackageId", "id", "included", "title", "updatedAt") SELECT "createdAt", "gigPackageId", "id", "included", "title", "updatedAt" FROM "GigPackageFeature";
DROP TABLE "GigPackageFeature";
ALTER TABLE "new_GigPackageFeature" RENAME TO "GigPackageFeature";
CREATE TABLE "new_user_skills" (
    "level" INTEGER NOT NULL DEFAULT 1,
    "skillId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,

    PRIMARY KEY ("skillId", "userId"),
    CONSTRAINT "user_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "Skill" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_skills_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_skills" ("createdAt", "level", "skillId", "updatedAt", "userId") SELECT "createdAt", "level", "skillId", "updatedAt", "userId" FROM "user_skills";
DROP TABLE "user_skills";
ALTER TABLE "new_user_skills" RENAME TO "user_skills";
CREATE UNIQUE INDEX "user_skills_skillId_userId_key" ON "user_skills"("skillId", "userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
