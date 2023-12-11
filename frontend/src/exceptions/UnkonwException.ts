import { MESSAGE } from '@src/constants/resources'

export class UnknownException extends Error {
  constructor() {
    super(MESSAGE.UNKNOWN_ERROR)
  }
}
