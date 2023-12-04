/*
  Warnings:

  - The values [SUSPENDED] on the enum `AdSubjectState` will be removed. If these variants are still used in the database, this will fail.
  - The values [DONE,PENDDING] on the enum `UserAdState` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hourEnd` on the `ads` table. All the data in the column will be lost.
  - You are about to drop the column `hourStart` on the `ads` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `ads` table. All the data in the column will be lost.
  - You are about to drop the column `useVideo` on the `ads` table. All the data in the column will be lost.
  - You are about to drop the column `useVoice` on the `ads` table. All the data in the column will be lost.
  - You are about to drop the column `weekDay` on the `ads` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `delete_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `update_at` on the `usersAds` table. All the data in the column will be lost.
  - Added the required column `hour_end` to the `ads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hour_start` to the `ads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `ads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `use_video` to the `ads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `use_voice` to the `ads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `subjects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `` to the `usersAds` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `usersAds` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdSubjectState_new" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');
ALTER TABLE "ads" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ads" ALTER COLUMN "status" TYPE "AdSubjectState_new" USING ("status"::text::"AdSubjectState_new");
ALTER TYPE "AdSubjectState" RENAME TO "AdSubjectState_old";
ALTER TYPE "AdSubjectState_new" RENAME TO "AdSubjectState";
DROP TYPE "AdSubjectState_old";
ALTER TABLE "ads" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserAdState_new" AS ENUM ('ACTIVE', 'INACTIVE', 'DELETED');
ALTER TABLE "usersAds" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "usersAds" ALTER COLUMN "status" TYPE "UserAdState_new" USING ("status"::text::"UserAdState_new");
ALTER TYPE "UserAdState" RENAME TO "UserAdState_old";
ALTER TYPE "UserAdState_new" RENAME TO "UserAdState";
DROP TYPE "UserAdState_old";
ALTER TABLE "usersAds" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "ads" DROP COLUMN "hourEnd",
DROP COLUMN "hourStart",
DROP COLUMN "update_at",
DROP COLUMN "useVideo",
DROP COLUMN "useVoice",
DROP COLUMN "weekDay",
ADD COLUMN     "hour_end" TIME NOT NULL,
ADD COLUMN     "hour_start" TIME NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "use_video" BOOLEAN NOT NULL,
ADD COLUMN     "use_voice" BOOLEAN NOT NULL,
ADD COLUMN     "week_day" "WeekDay"[] DEFAULT ARRAY[]::"WeekDay"[];

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "update_at",
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "delete_at",
DROP COLUMN "update_at",
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "usersAds" DROP COLUMN "update_at",
ADD COLUMN     "" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
