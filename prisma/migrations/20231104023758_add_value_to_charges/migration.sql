/*
  Warnings:

  - Added the required column `value` to the `Charge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "value" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "paid_at" DROP NOT NULL;
