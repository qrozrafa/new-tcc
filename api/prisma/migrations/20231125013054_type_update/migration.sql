/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "deleted_at",
ADD COLUMN     "delete_at" TIMESTAMP(3);
