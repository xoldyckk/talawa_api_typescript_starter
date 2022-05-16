import { ApplicationError } from './application-error';

export class NotFoundError extends ApplicationError {
  constructor(
    message: string,
    code: string | null = null,
    param: string | null = null,
    metadata = {}
  ) {
    const errorMessage = message || 'Not Found';
    const errorJson = [
      {
        message: errorMessage,
        code,
        param,
        metadata,
      },
    ];
    super(errorJson, 404, errorMessage);
  }
}

export default NotFoundError;
