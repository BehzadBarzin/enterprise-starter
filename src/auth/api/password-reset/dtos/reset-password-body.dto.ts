import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class ResetPasswordBodyDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsStrongPassword({
    minLength: 6,
  })
  @IsNotEmpty()
  password: string;
}
