/*
  Warnings:

  - You are about to drop the column `chatId` on the `UserChat` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `UserChat` table. All the data in the column will be lost.
  - Added the required column `chatIdUserChat` to the `UserChat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userIdUserChat` to the `UserChat` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserChat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userIdUserChat" INTEGER NOT NULL,
    "chatIdUserChat" INTEGER NOT NULL,
    CONSTRAINT "UserChat_userIdUserChat_fkey" FOREIGN KEY ("userIdUserChat") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserChat_chatIdUserChat_fkey" FOREIGN KEY ("chatIdUserChat") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserChat" ("id") SELECT "id" FROM "UserChat";
DROP TABLE "UserChat";
ALTER TABLE "new_UserChat" RENAME TO "UserChat";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
