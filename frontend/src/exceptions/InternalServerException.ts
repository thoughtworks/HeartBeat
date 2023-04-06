export class InternalServerException extends Error {
  constructor(message: string) {
    super()
    throw new Error(message)
  }
}
