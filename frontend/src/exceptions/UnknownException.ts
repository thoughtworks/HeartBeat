import { MESSAGE } from '@src/constants/resources';
import { IHeartBeatException } from '@src/exceptions/ExceptionType';

export class UnknownException extends Error implements IHeartBeatException {
  constructor() {
    super(MESSAGE.UNKNOWN_ERROR);
  }
}
