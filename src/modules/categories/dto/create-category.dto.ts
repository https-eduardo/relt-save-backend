import { IsNotEmpty, IsString, Matches } from 'class-validator';

const COLOR_REGEX = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(COLOR_REGEX)
  color: string;
}
