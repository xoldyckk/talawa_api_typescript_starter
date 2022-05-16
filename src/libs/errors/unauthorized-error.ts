import { ApplicationError } from './application-error';

export class UnauthorizedError extends ApplicationError {
  constructor(
    message: string,
    code: string | null = null,
    param: string | null = null,
    metadata = {}
  ) {
    const errorMessage = message || 'UnauthorizedError';
    const errorJson = [
      {
        message: errorMessage,
        code,
        param,
        metadata,
      },
    ];
    super(errorJson, 403, errorMessage);
  }
}

export default UnauthorizedError;
