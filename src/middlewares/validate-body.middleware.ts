import { plainToClass } from 'class-transformer';
import { ValidationError, validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

import { RequestValidationError } from '../errors/request-validation.error';

/**
 * Creates a middleware that validates the request body using the DTO.
 * We must pass the DTO Class itself as the argument.
 *
 * ```ts
 * router.post("/users", validateBody(CreateUserDTO), usersController.createUser);
 * ```
 *
 * @param dtoClass - DTO Class
 */
export function validateBody<DTO>(dtoClass: new () => DTO) {
  // Returns the actual middleware
  return async (req: Request, res: Response, next: NextFunction) => {
    // Create an instance of the DTO from the request body
    const dtoInstance: DTO = plainToClass(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoInstance as any, {
      whitelist: true, // ⭐ Skip any properties that are not defined in the DTO
    });

    // Validation Failed
    if (errors.length > 0) {
      throw new RequestValidationError(errors);
      return;
    }

    // Validation Passed
    // Replace the request body with the DTO
    req.body = dtoInstance;

    next();
    return;
  };
}
