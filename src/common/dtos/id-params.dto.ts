import { IsNotEmpty, IsNumber, IsDecimal } from 'class-validator';

/**
 * A common DTO class used to validate req.params of routes that require an ID.
 *
 * Example: /.../:id/...
 */
export class IdParamsDTO {
  @IsDecimal()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
