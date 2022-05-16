import { ApplicationError } from './application-error';

export class UnauthenticatedError extends ApplicationError {
  constructor(
    message: string,
    code: string | null = null,
    param: string | null = null,
    metadata = {}
  ) {
    const errorMessage = message || 'UnauthenticatedError';
    const errorJson = [
      {
        message: errorMessage,
        code,
        param,
        metadata,
      },
    ];
    super(errorJson, 401, errorMessage);
  }
}

export default UnauthenticatedError;
