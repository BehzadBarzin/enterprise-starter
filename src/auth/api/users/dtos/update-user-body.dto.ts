import { IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class UpdateUserBodyDTO {
  @IsEmail()
  @IsOptional()
  email?: string;

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
