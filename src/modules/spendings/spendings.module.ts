import { Module } from '@nestjs/common';
import { SpendingsService } from './spendings.service';
import { SpendingsController } from './spendings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Spending, SpendingSchema } from 'src/schemas/spending.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Spending.name, schema: SpendingSchema },
    ]),
  ],
  controllers: [SpendingsController],
  providers: [SpendingsService],
})
export class SpendingsModule {}
