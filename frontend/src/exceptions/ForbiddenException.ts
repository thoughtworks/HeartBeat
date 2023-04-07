export class ForbiddenException extends Error {
  constructor(message: string) {
    super()
    throw new Error(message)
  }
}
