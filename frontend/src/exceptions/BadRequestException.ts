export class BadRequestException extends Error {
  constructor(type: string, message: string) {
    super()
    throw new Error(`Failed to request to ${type}, message: ${message}`)
  }
}
