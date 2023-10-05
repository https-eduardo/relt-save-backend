/*
  Warnings:

  - You are about to drop the column `bank_account` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_bank_account_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "bank_account",
ADD COLUMN     "bank_account_id" INTEGER;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bank_account_id_fkey" FOREIGN KEY ("bank_account_id") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
