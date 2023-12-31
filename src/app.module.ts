import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { BankAccountModule } from './modules/bank-accounts/bank-accounts.module';
import { BudgetsModule } from './modules/budgets/budgets.module';
import { CardsModule } from './modules/cards/cards.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BanksModule } from './modules/banks/banks.module';
import { ChargesModule } from './modules/charges/charges.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    PrismaModule,
    BankAccountModule,
    BudgetsModule,
    CardsModule,
    CategoriesModule,
    TransactionsModule,
    BanksModule,
    ChargesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
