import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class LoginBodyDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}