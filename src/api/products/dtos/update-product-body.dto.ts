import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductBodyDTO {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
