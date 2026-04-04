/*
  Warnings:

  - A unique constraint covering the columns `[tokenId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tokenId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_tokenId_key" ON "User"("tokenId");
