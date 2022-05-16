import { ApplicationError } from './application-error';

export class ValidationError extends ApplicationError {
  constructor(errors: any[], message: string) {
    super(errors || [], 422, message || 'Validation error');
  }
}

export default ValidationError;
