import { OmitType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { UserProvider } from 'src/common/types/user-provider.type';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsUrl()
  profile_url: string;
}

export class CreateGoogleUserDto extends OmitType(CreateUserDto, [
  'password',
]) {}
