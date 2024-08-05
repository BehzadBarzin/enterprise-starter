import { ValidationError } from 'class-validator';

import { BaseError } from './base.error';

export class RequestValidationError extends BaseError {
  statusCode = 400;

  // Accepts an array of 'ValidationError' objects from the 'class-validator' package
  constructor(private errors: ValidationError[]) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  // Returns the first error message from the 'ValidationError' object's 'constraints' property
  private getFirstValue(validationError: ValidationError): string {
    if (validationError.constraints) {
      const firstKey = Object.keys(validationError.constraints)[0];
      if (firstKey) {
        const firstValue = validationError.constraints[firstKey];
        return firstValue || 'Unknown Error';
      }
    }
    return 'Unknown Error';
  }

  serializeErrors() {
    // Map over all validation errors and transform them to the correct type
    // For each field, we just return the first validation constraint error
    return this.errors.map((err: ValidationError) => {
      return { message: this.getFirstValue(err), field: err.property };
    });
  }
}
