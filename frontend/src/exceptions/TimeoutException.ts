export class TimeoutException extends Error {
  constructor(message: string) {
    super()
    throw new Error(message)
  }
}
