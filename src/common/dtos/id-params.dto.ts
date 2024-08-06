import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

/**
 * A common DTO class used to validate req.params of routes that require an ID.
 *
 * Example: /.../:id/...
 */
export class IdParamsDTO {
  @Type(() => Number) // Because params are strings, we must explicitly parse them using class-transformer
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
