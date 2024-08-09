import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductBodyDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;
}
