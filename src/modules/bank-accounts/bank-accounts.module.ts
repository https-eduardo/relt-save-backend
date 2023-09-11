import { Module } from '@nestjs/common';
import { BankAccountsService } from './bank-accounts.service';
import { BankAccountsController } from './bank-accounts.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [BankAccountsController],
  providers: [BankAccountsService],
  imports: [PrismaModule],
})
export class BankAccountModule {}
