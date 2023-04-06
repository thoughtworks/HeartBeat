export class BadRequestException extends Error {
  constructor(message: string) {
    super()
    throw new Error(message)
  }
}
