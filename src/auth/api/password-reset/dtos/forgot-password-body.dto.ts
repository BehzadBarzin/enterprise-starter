import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordBodyDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
