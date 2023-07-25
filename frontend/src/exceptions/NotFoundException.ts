export class NotFoundException extends Error {
  constructor(message: string) {
    super()
    throw new Error(message)
  }
}
