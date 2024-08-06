import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

export class RegisterBodyDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({
    minLength: 6,
  })
  @IsNotEmpty()
  password: string;
}
