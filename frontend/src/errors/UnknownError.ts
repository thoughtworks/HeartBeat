import { IHeartBeatError } from '@src/errors/ErrorType';
import { MESSAGE } from '@src/constants/resources';

export class UnknownError extends Error implements IHeartBeatError {
  constructor() {
    super(MESSAGE.UNKNOWN_ERROR);
  }
}
