/*
  Warnings:

  - You are about to drop the column `logoUrl` on the `Bank` table. All the data in the column will be lost.
  - Added the required column `logo_url` to the `Bank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bank" DROP COLUMN "logoUrl",
ADD COLUMN     "logo_url" TEXT NOT NULL;
