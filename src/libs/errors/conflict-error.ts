import { ApplicationError } from './application-error';

export class ConflictError extends ApplicationError {
  constructor(
    message: string,
    code: string | null = null,
    param: string | null = null,
    metadata = {}
  ) {
    const errorMessage = message || 'Conflicting entry found';
    const errorJson = [
      {
        message: errorMessage,
        code,
        param,
        metadata,
      },
    ];
    super(errorJson, 409, errorMessage);
  }
}

export default ConflictError;
