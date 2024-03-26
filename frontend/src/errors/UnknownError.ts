import { MESSAGE } from '@src/constants/resources';
import { IAppError } from '@src/errors/ErrorType';

export class UnknownError extends Error implements IAppError {
  constructor() {
    super(MESSAGE.UNKNOWN_ERROR);
  }
}
