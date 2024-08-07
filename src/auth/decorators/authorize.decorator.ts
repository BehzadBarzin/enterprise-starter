import { RequestHandler } from 'express';

import { prisma } from '../../utils/prisma';
import authorize from '../middlewares/authorize';

export function Authorize(actionName?: string, actionDescription?: string) {
  // ---------------------------------------------------------------------------
  // If actionName is provided, authorization is required
  if (actionName) {
    // Check to see if the action permission doesn't exist in the database, create it.
    prisma.permission
      .upsert({
        where: {
          action: actionName,
        },
        update: {},
        create: {
          action: actionName,
          description: actionDescription,
        },
      })
      .then(() => {});
  }
  // ---------------------------------------------------------------------------
  // Create the auth middleware
  // If actionName is provided, it'll check for authorization, if not it will just check for authentication
  // Remember "authorize" method is a middleware factory that returns a new middleware
  const authMiddleware: RequestHandler = authorize(actionName);
  // ---------------------------------------------------------------------------
  // Create and return the decorator
  return function (target: any, propertyKey: string) {
    // target: our controller class
    // propertyKey: the name of field on the controller class

    // Remember: this decorator is running in the class definition phase so "controller[propertyKey]" is not defined yet.

    // Create a symbol to refer to the class member we're trying to modify
    const prop = Symbol();

    // Define getter and setter for the targeted property to modify its set and get behavior
    Object.defineProperty(target, propertyKey, {
      // Runs when we want to access, controllerInstance.property
      get: function () {
        return this[prop];
      },
      // Runs when we want to set, controllerInstance.property = [...], for example in the class definition step
      set: function (newValue: RequestHandler[]) {
        // Add the auth middleware to the list of request handlers:
        this[prop] = [authMiddleware, ...newValue];
      },
      enumerable: true,
      configurable: true,
    });
  };
  // ---------------------------------------------------------------------------
}
