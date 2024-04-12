import { IAppError } from '@src/errors/ErrorType';

export class TimeoutError extends Error implements IAppError {
  code: number | string;
  constructor(message: string, status: number | string) {
    super(message);
    this.code = status;
  }
}
