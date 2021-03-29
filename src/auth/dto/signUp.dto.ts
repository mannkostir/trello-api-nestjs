import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  passwordConfirmation: string;
}
