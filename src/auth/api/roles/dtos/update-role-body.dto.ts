import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRoleBodyDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { each: true })
  @IsOptional()
  permissions?: number[];
}
