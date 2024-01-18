import { IHeartBeatException } from '@src/exceptions/ExceptionType';

export class TimeoutException extends Error implements IHeartBeatException {
  code: number | string;
  constructor(message: string, status: number | string) {
    super(message);
    this.code = status;
  }
}
