-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "due_date" DROP NOT NULL,
ALTER COLUMN "installments" SET DEFAULT 1,
ALTER COLUMN "paid_at" DROP NOT NULL;
