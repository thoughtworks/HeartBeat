import { UNKNOWN_ERROR_MESSAGE } from '@src/constants'

export class UnknownException extends Error {
  constructor() {
    super()
    throw new Error(UNKNOWN_ERROR_MESSAGE)
  }
}
