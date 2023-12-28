import { IsEmail, IsString, MinLength } from 'class-validator';

// TODO: Improve password validation soon
export class AuthLoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
