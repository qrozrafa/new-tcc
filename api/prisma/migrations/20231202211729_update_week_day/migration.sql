/*
  Warnings:

  - The `weekDay` column on the `ads` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'ALLDAYS');

-- AlterTable
ALTER TABLE "ads" DROP COLUMN "weekDay",
ADD COLUMN     "weekDay" "WeekDay"[] DEFAULT ARRAY[]::"WeekDay"[],
ALTER COLUMN "hourStart" SET DATA TYPE TIME,
ALTER COLUMN "hourEnd" SET DATA TYPE TIME;
