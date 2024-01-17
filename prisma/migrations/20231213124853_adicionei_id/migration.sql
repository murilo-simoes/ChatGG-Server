/*
  Warnings:

  - Added the required column `id` to the `UserChat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserChat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    CONSTRAINT "UserChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserChat_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserChat" ("chatId", "userId") SELECT "chatId", "userId" FROM "UserChat";
DROP TABLE "UserChat";
ALTER TABLE "new_UserChat" RENAME TO "UserChat";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
