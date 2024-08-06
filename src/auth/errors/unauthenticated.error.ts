import { BaseError } from '../../errors/base.error';

export class UnauthenticatedError extends BaseError {
  statusCode = 401;

  constructor() {
    super('Unauthenticated');

    Object.setPrototypeOf(this, UnauthenticatedError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Unauthenticated' }];
  }
}
