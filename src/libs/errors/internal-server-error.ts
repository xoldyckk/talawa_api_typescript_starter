import { ApplicationError } from './application-error';

export class InternalServerError extends ApplicationError {
  constructor(
    message: string,
    code: string | null = null,
    param: string | null = null,
    metadata = {}
  ) {
    const errorMessage = message || 'Internal Server Error!';

    const errorJson = [
      {
        message: errorMessage,
        code,
        param,
        metadata,
      },
    ];
    super(errorJson, 500, errorMessage);
  }
}

export default InternalServerError;
