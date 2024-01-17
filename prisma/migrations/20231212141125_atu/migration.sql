/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Chat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Chat` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `chatId` on the `Messages` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `id` on the `Messages` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT
);
INSERT INTO "new_User" ("email", "id", "name", "password") SELECT "email", "id", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Chat" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fromAuthorId" INTEGER NOT NULL,
    "toAuthorId" INTEGER NOT NULL
);
INSERT INTO "new_Chat" ("fromAuthorId", "id", "toAuthorId") SELECT "fromAuthorId", "id", "toAuthorId" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
CREATE TABLE "new_Messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "message" TEXT NOT NULL,
    "sendId" INTEGER NOT NULL,
    "receiveId" INTEGER NOT NULL,
    "chatId" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Messages" ("chatId", "createAt", "id", "message", "receiveId", "sendId") SELECT "chatId", "createAt", "id", "message", "receiveId", "sendId" FROM "Messages";
DROP TABLE "Messages";
ALTER TABLE "new_Messages" RENAME TO "Messages";
CREATE UNIQUE INDEX "Messages_chatId_key" ON "Messages"("chatId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
