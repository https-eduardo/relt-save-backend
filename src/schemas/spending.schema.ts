import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type SpendingDocument = HydratedDocument<Spending>;

@Schema({ timestamps: true })
export class Spending {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: User;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  value: number;

  @Prop({ required: true, enum: ['fixed', 'variable'] })
  type: string;

  @Prop({ enum: ['monthly', 'weekly', 'biweekly', 'daily'] })
  paymentInterval: string;

  @Prop()
  category: SpendingCategory;

  @Prop()
  paymentDate: Date;
}

export const SpendingSchema = SchemaFactory.createForClass(Spending);
