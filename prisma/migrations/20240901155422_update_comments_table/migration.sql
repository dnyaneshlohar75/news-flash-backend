/*
  Warnings:

  - You are about to drop the column `isAuthor` on the `users` table. All the data in the column will be lost.
  - Added the required column `userId` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('user', 'admin', 'author');

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isAuthor",
ADD COLUMN     "type" "UserType" NOT NULL DEFAULT 'user';

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
