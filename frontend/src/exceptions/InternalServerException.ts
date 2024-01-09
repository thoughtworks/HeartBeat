export class InternalServerException extends Error {
  code: number
  constructor(message: string, status: number) {
    super(message)
    this.code = status
  }
}
