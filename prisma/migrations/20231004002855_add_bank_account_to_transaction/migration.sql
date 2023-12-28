-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bank_account" INTEGER;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bank_account_fkey" FOREIGN KEY ("bank_account") REFERENCES "BankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
