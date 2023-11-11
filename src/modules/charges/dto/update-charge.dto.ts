import { Transform } from 'class-transformer';
import { ValidateIf, isDate } from 'class-validator';

export class UpdateChargeDto {
  @Transform(({ value }) => (value ? new Date(value) : null))
  @ValidateIf((_, value) => value === null || isDate(value))
  paidAt: Date | null;
}
