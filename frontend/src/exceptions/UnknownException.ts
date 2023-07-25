import { UNKNOWN_EXCEPTION } from '@src/constants'

export class UnknownException extends Error {
  constructor() {
    super()
    throw new Error(UNKNOWN_EXCEPTION)
  }
}
