import { BaseError } from '../../errors/base.error';

export class ForbiddenError extends BaseError {
  statusCode = 403;

  constructor() {
    super('Forbidden');

    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Forbidden' }];
  }
}
