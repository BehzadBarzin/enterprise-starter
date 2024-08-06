import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsStrongPassword } from 'class-validator';

export class CreateUserBodyDTO {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword({
    minLength: 6,
  })
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsOptional()
  confirmed?: boolean;

  @IsBoolean()
  @IsOptional()
  blocked?: boolean;

  @IsNumber({}, { each: true })
  @IsOptional()
  roles?: number[];
}
