import { IHeartBeatException } from '@src/exceptions/ExceptionType'

export class UnauthorizedException extends Error implements IHeartBeatException {
  code: number
  constructor(message: string, status: number) {
    super(message)
    this.code = status
  }
}
