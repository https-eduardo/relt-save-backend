import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class FindCategoryByIdDto {
  @IsNumber()
  @Transform(({ value }) => Number(value))
  categoryId: number;
}
