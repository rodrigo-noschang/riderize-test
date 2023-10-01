/*
  Warnings:

  - Made the column `ride_city` on table `rides` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ride_uf` on table `rides` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "rides" ALTER COLUMN "ride_city" SET NOT NULL,
ALTER COLUMN "ride_uf" SET NOT NULL;
