import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Spending } from './spending.schema';

export type SpendingLogDocument = HydratedDocument<SpendingLog>;

@Schema({ timestamps: { createdAt: true } })
export class SpendingLog {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Spending',
    required: true,
  })
  spendingId: Spending;
}

export const SpendingLogSchema = SchemaFactory.createForClass(SpendingLog);
