import { IHeartBeatException } from '@src/exceptions/ExceptionType';

export class BadRequestException extends Error implements IHeartBeatException {
  code: number;
  description?: string;
  constructor(message: string, status: number, description: string) {
    super(message);
    this.description = description;
    this.code = status;
  }
}
