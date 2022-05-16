export class ApplicationError extends Error {
  errors: any[];
  httpCode: number;
  constructor(errors: any[], httpCode: number, message: string) {
    super(message || 'Error');
    this.httpCode = httpCode || 422;
    this.errors = errors;
  }
}

export default ApplicationError;
