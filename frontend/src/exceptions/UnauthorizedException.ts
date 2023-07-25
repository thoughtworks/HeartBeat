export class UnauthorizedException extends Error {
  constructor(message: string) {
    super()
    throw new Error(message)
  }
}
