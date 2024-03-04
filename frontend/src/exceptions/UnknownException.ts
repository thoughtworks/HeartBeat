import { IHeartBeatException } from '@src/exceptions/ExceptionType';
import { MESSAGE } from '@src/constants/resources';

export class UnknownException extends Error implements IHeartBeatException {
  constructor() {
    super(MESSAGE.UNKNOWN_ERROR);
  }
}
