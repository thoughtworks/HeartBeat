export class PlatformTypeError extends Error {
  constructor(typeName: string) {
    super(`Unsupported type: ${typeName}.`);
  }
}
