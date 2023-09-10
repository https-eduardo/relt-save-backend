import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [BankAccountController],
  providers: [BankAccountService],
  imports: [PrismaModule],
})
export class BankAccountModule {}
