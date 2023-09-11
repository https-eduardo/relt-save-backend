import { Module } from '@nestjs/common';
import { BudgetsService } from './budgets.service';
import { BudgetsController } from './budgets.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [BudgetsController],
  providers: [BudgetsService],
  imports: [PrismaModule],
})
export class BudgetsModule {}
