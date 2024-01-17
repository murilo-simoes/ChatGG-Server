/*
  Warnings:

  - You are about to drop the column `fromAuthorEmail` on the `Chat` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "toAuthorEmail" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL DEFAULT 2,
    CONSTRAINT "Chat_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("id", "toAuthorEmail") SELECT "id", "toAuthorEmail" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
