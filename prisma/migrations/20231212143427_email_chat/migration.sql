/*
  Warnings:

  - You are about to drop the column `fromAuthorId` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `toAuthorId` on the `Chat` table. All the data in the column will be lost.
  - Added the required column `fromAuthorEmail` to the `Chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAuthorEmail` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromAuthorEmail" TEXT NOT NULL,
    "toAuthorEmail" TEXT NOT NULL
);
INSERT INTO "new_Chat" ("id") SELECT "id" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
