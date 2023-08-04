import { UNKNOWN_ERROR_MESSAGE } from '@src/constants'

export class UnknownException extends Error {
  constructor() {
    super(UNKNOWN_ERROR_MESSAGE)
  }
}
