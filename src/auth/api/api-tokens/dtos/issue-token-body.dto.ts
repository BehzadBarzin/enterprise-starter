import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class IssueTokenBodyDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  fullAccess?: boolean;

  @IsDate()
  @IsOptional()
  expiresAt?: Date;
}
