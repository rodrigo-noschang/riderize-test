/*
  Warnings:

  - Added the required column `creator_id` to the `rides` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_ride_id_fkey";

-- DropForeignKey
ALTER TABLE "registrations" DROP CONSTRAINT "registrations_user_id_fkey";

-- AlterTable
ALTER TABLE "rides" ADD COLUMN     "creator_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "rides" ADD CONSTRAINT "rides_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_ride_id_fkey" FOREIGN KEY ("ride_id") REFERENCES "rides"("ride_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
